import { StateController } from '@lit-app/state';
import { PropertyValueMap, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import styles from './styles/app.styles';
import './components/common/icon/icon';
import './components/header/header';
import './components/footer/footer';
import './components/message-list/message-list';
import './components/user-input/user-input';
import './components/setting/setting';
import './components/anchor/anchor';
import './components/auth/auth-alert';
import './components/common/thinking/thinking';

import { appState } from './store/app.state';
import { ChatbotElement } from './common/chatbot-element';

import * as openai from './service/openai';
import { fetchStream } from './utils/request';
import { uploadFile } from './service/server';
import { notify } from './utils/message';

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
    @property({ type: Boolean, attribute: 'open' })
    open = false;

    // loading flag
    @property({ type: Boolean })
    loading = false;

    // show setting
    @property({ type: Boolean })
    showSetting = false;

    // show auth alert
    @property({ type: Boolean })
    showAuthAlert = false;

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
            ${when(
                this.open,
                () => html` <div class="cb-wrapper">
                    <cb-header title="${this.name}"></cb-header>
                    <div class="cb-alert-box">
                        ${this.showAuthAlert
                            ? html`<cb-auth-alert></cb-auth-alert>`
                            : ''}
                    </div>
                    <cb-message-list
                        .messages=${appState.messages}
                    ></cb-message-list>
                    <cb-setting
                        ?open=${this.showSetting}
                        .setting=${appState.setting}
                    ></cb-setting>
                    <cb-user-input
                        ?loading=${this.loading}
                        ?disabled=${this.loading || this.showAuthAlert}
                        ?enable-file-upload=${this.enableFileUpload}
                    ></cb-user-input>
                    ${this.displayLicense ? html`<cb-footer></cb-footer>` : ''}
                </div>`,
                () => null,
            )}
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
        addEventListener('chatbot:toggle', (event: Event) => {
            const detail = (event as CustomEvent).detail;
            this.open = detail.open;
        });

        // listen clear cache
        addEventListener('message:clear', () => {
            appState.clearMessages();
        });

        // listen send file
        addEventListener('message:send:file', this._sendFileHandler.bind(this));

        // listen show setting
        addEventListener('setting:show', () => {
            this.showSetting = true;
        });
    }

    protected updated(
        _changedProperties:
            | PropertyValueMap<unknown>
            | Map<PropertyKey, unknown>,
    ): void {
        super.updated(_changedProperties);

        // init setting
        this._initSetting();

        if (!this.customRequest) {
            this._checkAuth();
        }

        setTimeout(() => {
            this._scrollToBottom();
        }, 0);
    }

    public setLoading(val: boolean) {
        this.loading = val;
    }

    // fetch sse stream
    public fetchStream = fetchStream;

    // check auth
    private _checkAuth() {
        if (!appState.setting.openai.apiKey) {
            this.showAuthAlert = true;
        } else {
            this.showAuthAlert = false;
        }
    }

    // send to openai
    private async _sendToOpenai(
        newMsg: Chatbot.NewMessage,
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
                model: appState.setting.openai.model,
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

        const newMsg: Chatbot.NewMessage = {
            author: 'assistant',
            type: 'text',
            isThinking: true,
            data: {},
        };

        // add message to store
        appState.addMessage(newMsg);

        if (this.customRequest) {
            await this.emit('chatbot:send', {
                detail: {
                    newMessage: newMsg,
                    messages,
                },
                bubbles: true,
                composed: true,
            });
        } else {
            try {
                await this._sendToOpenai(newMsg, messages);
            } catch (err) {
                notify('error', (err as Error).message);
                console.error(err);
            }
        }

        this.setLoading(false);
    }

    private _addMessageHandler(event: Event) {
        const detail = (event as CustomEvent).detail;

        // add message to state
        appState.addMessage(detail as Chatbot.Message);

        const messages = appState.messages
            .filter((message) => {
                return message.type === 'text';
            })
            .map((message) => {
                return {
                    role: message.author,
                    content: message.data.text,
                } as Chatbot.OpenaiMessage;
            });

        // send message to bot
        const sendMessages = appState.setting.useContext
            ? messages
            : [messages[messages.length - 1]];
        this._sendHandler(sendMessages);
    }

    private _deleteMessageHandler(event: Event) {
        const detail = (event as CustomEvent).detail;
        appState.removeMessage(detail.id);
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
        const newMsg: Chatbot.NewMessage = {
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

        // check auth
        this._checkAuth();
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
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-bot': ChatBot;
    }
}
