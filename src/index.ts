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

import { appState } from './store/app.state';
import { ChatbotElement } from './common/chatbot-element';

import * as openai from './service/openai';
import { uuid } from './utils';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('chat-bot')
export default class ChatBot extends ChatbotElement {
    static styles = styles;

    private state = new StateController(this, appState);

    // display license
    @property({ type: Boolean, attribute: 'display-license' })
    displayLicense = true;

    // bot name
    @property({ type: String, attribute: 'name' })
    name = 'ChatBot';

    // custom send handler
    @property({ type: Boolean, attribute: 'custom-send-handler' })
    customSendHandler = false;

    // stream
    @property({ type: Boolean, attribute: 'stream' })
    stream = false;

    // loading flag
    @property({ type: Boolean })
    loading = false;

    // show setting
    @property({ type: Boolean })
    showSetting = false;

    // open flag
    @property({ type: Boolean, attribute: true })
    open = false;

    @query('cb-message-list')
    private _messageList: HTMLElement;

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
                      <cb-user-input loading=${this.loading}></cb-user-input>
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
    }

    // setting confirm handler
    private _settingConfirmHandler(event: Event) {
        const detail = (event as CustomEvent).detail;
        appState.setSetting(detail.setting);
        this.showSetting = false;
    }

    // scroll to bottom
    private _scrollToBottom() {
        requestIdleCallback(() => {
            this._messageList?.scrollTo({
                top: this._messageList.scrollHeight,
                behavior: 'auto',
            });
        });
    }

    protected updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
    ): void {
        super.updated(_changedProperties);
        this._scrollToBottom();

        // check auth setting
        this._checkAuth();
    }

    // check auth
    private _checkAuth() {
        if (!appState.setting.openai.apiKey) {
            // this.showSetting = true;
        }
    }

    public setLoading(val: boolean) {
        this.loading = val;
    }

    // send to bot service
    private async _sendHandler(messages: Chatbot.OpenaiMessage[]) {
        this.setLoading(true);

        const newMsg: Chatbot.Message = {
            id: uuid(),
            author: 'bot',
            type: 'text',
            data: {
                text: '...',
            },
        };

        // add message to state
        appState.addMessage(newMsg);

        let text = '';
        const data = await openai.chat({
            apiKey: appState.setting.openai.apiKey,
            messages: messages,
            options: {
                stream: this.stream,
                model: 'gpt-3.5-turbo',
                // temperature: 0.9,
            },
            onMessage: (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // console.log('data', data);
                if (data) {
                    // handle openai response
                    text += data.choices[0].delta.content;
                    newMsg.data.text = text;
                    // update message
                    appState.updateMessage(newMsg);
                }
            },
        });
        if (!this.stream && data) {
            newMsg.data.text = data.choices[0].message.content;
            // update message
            appState.updateMessage(newMsg);
        }

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
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-bot': ChatBot;
    }
}
