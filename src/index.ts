import { StateController } from '@lit-app/state';
import { PropertyValueMap, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import styles from './styles/app.styles';
import './components/header/header';
import './components/footer/footer';
import './components/message-list/message-list';
import './components/user-input/user-input';
import './components/setting/setting';
import './components/anchor/anchor';
import './components/common/thinking/thinking';

import { appState } from './store/app.state';
import { ChatbotElement } from './common/chatbot-element';

import * as openai from './service/openai';
import { uuid } from './utils';
import { fetchStream } from './utils/request';
import { uploadFile } from './service/server';

@customElement('chat-bot')
export default class ChatBot extends ChatbotElement {
    static styles = styles;

    // @ts-ignore
    private store = new StateController(this, appState);

    /**
     * display license
     */
    @property({ type: Boolean, attribute: 'display-license' })
    displayLicense = true;

    /**
     * bot name, default: ChatBot
     */
    @property({ type: String, attribute: 'name' })
    name = 'ChatBot';

    /**
     * custom send handler, default: false
     */
    @property({ type: Boolean, attribute: 'custom-send-handler' })
    customSendHandler = false;

    /**
     * stream mode, default: false
     */
    @property({ type: Boolean, attribute: 'stream' })
    stream = false;

    /**
     * custom request, default: false
     */
    @property({ type: Boolean, attribute: 'custom-request' })
    customRequest = false;

    /**
     * enable file upload, default: false
     */
    @property({ type: Boolean, attribute: 'enable-file-upload' })
    enableFileUpload = false;

    /**
     * custom upload file url, must be set when enableFileUpload is true, default: ''
     */
    @property({ type: String, attribute: 'upload-file-url' })
    uploadFileUrl = '';

    /**
     * whether auto open chatbot, default: false
     */
    @property({ type: Boolean, attribute: true })
    open = false;

    // loading flag
    @property({ type: Boolean })
    loading = false;

    // show setting
    @property({ type: Boolean })
    showSetting = false;

    @query('cb-message-list')
    private _messageList: HTMLElement;

    /**
     * decodeStreamData
     */
    public decodeStreamData(data: Uint8Array) {
        const decoder = new TextDecoder();
        return decoder.decode(data);
    }

    render() {
        return html`
            ${this.open
                ? html`<div class="cb-wrapper">
                      <cb-header title="${this.name}"></cb-header>
                      <cb-message-list
                          .messages=${appState.messages}
                      ></cb-message-list>
                      <cb-setting
                          ?open=${this.showSetting}
                          .setting=${appState.setting}
                      ></cb-setting>
                      <cb-user-input
                          ?loading=${this.loading}
                          ?enable-file-upload=${this.enableFileUpload}
                      ></cb-user-input>
                      ${this.displayLicense
                          ? html`<cb-footer></cb-footer>`
                          : ''}
                  </div>`
                : ``}
            <cb-anchor ?open=${this.open}></cb-anchor>
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();

        // listen open
        addEventListener('setting:show', () => {
            this.showSetting = true;
        });

        // listen message send
        addEventListener('message:send', this._addMessageHandler.bind(this));

        // listen message remove
        addEventListener(
            'message:remove',
            this._deleteMessageHandler.bind(this),
        );

        // listen setting confirm
        addEventListener(
            'setting:confirm',
            this._settingConfirmHandler.bind(this),
        );

        // listen setting cancel
        addEventListener('setting:hide', () => {
            this.showSetting = false;
        });

        // listen toggle open
        addEventListener('toggle:open', (event: Event) => {
            const detail = (event as CustomEvent).detail;
            this.open = detail.open;
        });

        // listen clear cache
        addEventListener('message:clear', () => {
            appState.clearMessages();
        });

        // listen send file
        addEventListener('message:send:file', this._sendFileHandler.bind(this));
    }

    private async _sendFileHandler(event: Event) {
        const detail = (event as CustomEvent).detail as {
            files: File[];
        };

        // add file message
        const uploadFileInfos = detail.files.map((file, index) => {
            return {
                id: `${file.name}-${index}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: '',
            };
        });
        const newMsg: Chatbot.Message = {
            id: uuid(),
            author: 'user',
            type: 'file',
            isUploading: true,
            data: {
                files: uploadFileInfos,
            },
        };

        appState.addMessage(newMsg);

        if (this.uploadFileUrl) {
            // upload file to server
            const res = await uploadFile(this.uploadFileUrl, detail.files);
            if (res.code === 0 && res.data) {
                newMsg.isUploading = false;
                newMsg.data = {
                    files: res.data,
                };

                appState.updateMessage(newMsg);
            }
        }

        this.emit('chatbot:file:send', {
            detail: {
                files: detail.files,
                message: newMsg,
            },
        });
    }

    // initialize setting
    private _initSetting() {
        const setting = appState.setting;
        setting.stream = this.stream;
        setting.customRequest = this.customRequest;
        setting.enableUploadFile = this.enableFileUpload;
        setting.uploadFileUrl = this.uploadFileUrl;

        appState.setSetting(setting);
    }

    // setting confirm handler
    private _settingConfirmHandler(event: Event) {
        const detail = (event as CustomEvent).detail;
        appState.setSetting(detail.setting);
        this.showSetting = false;
    }

    // scroll to bottom
    private _scrollToBottom(smooth = false) {
        requestIdleCallback(() => {
            this._messageList?.scrollTo({
                top: this._messageList.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
        });
    }

    protected updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
    ): void {
        super.updated(_changedProperties);

        // init setting
        this._initSetting();

        setTimeout(() => {
            this._scrollToBottom();
        }, 0);
    }

    public setLoading(val: boolean) {
        this.loading = val;
    }

    // send to openai
    private async _sendToOpenai(
        newMsg: Chatbot.Message,
        messages: Chatbot.OpenaiMessage[],
    ) {
        let text = '';
        const apiBase =
            appState.setting.openai.apiBase || 'https://api.openai.com/v1';
        const data = await openai.chat({
            url: `${apiBase}/chat/completions`,
            apiKey: appState.setting.openai.apiKey,
            messages: messages,
            options: {
                stream: appState.setting.stream,
                model: appState.setting.model,
                // temperature: 0.9,
            },
            onMessage: (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (data && data.choices[0].delta?.content) {
                    requestIdleCallback(() => {
                        // handle openai response
                        text += data.choices[0].delta.content;
                        // update message
                        appState.updateMessage(newMsg, text);
                    });
                }
            },
        });
        if (!appState.setting.stream && data) {
            // update message
            appState.updateMessage(newMsg, data.choices[0].message.content);
        }
    }

    // send to bot service
    private async _sendHandler(messages: Chatbot.OpenaiMessage[]) {
        this.setLoading(true);

        const newMsg: Chatbot.Message = {
            id: uuid(),
            author: 'bot',
            type: 'text',
            isThinking: true,
            data: {},
        };

        // add message to store
        appState.addMessage(newMsg);

        if (this.customRequest) {
            const data = await this.emit('chatbot:send', {
                detail: {
                    newMessage: newMsg,
                    messages,
                },
                bubbles: true,
                composed: true,
            });
            this.setLoading(false);
            return data;
        }
        await this._sendToOpenai(newMsg, messages);

        this.setLoading(false);
    }

    private _addMessageHandler(event: Event) {
        const detail = (event as CustomEvent).detail;

        // add message to state
        appState.addMessage(detail as Chatbot.Message);

        const messages = appState.messages.map((message) => {
            return {
                role: message.author,
                content: message.data.text,
            } as Chatbot.OpenaiMessage;
        });

        // send message to bot
        if (!this.customSendHandler) {
            this._sendHandler([messages[messages.length - 1]]);
        }
    }

    private _deleteMessageHandler(event: Event) {
        const detail = (event as CustomEvent).detail;
        appState.removeMessage(detail.id);
    }

    // fetch sse stream
    public fetchStream = fetchStream;
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-bot': ChatBot;
    }
}
