import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';

import { ChatbotElement } from '../../common/chatbot-element';
import '../common/thinking/thinking';
import '../common/uploading/uploading';
import '../file/file';

import styles from './message.styles';
import { parse } from '../../utils/markdown';
import { copyToClipboard } from '../../utils';

@customElement('cb-message')
export class Message extends ChatbotElement {
    static styles = styles;

    @property({ type: Object })
    message: Chatbot.Message;

    @property()
    type: 'user' | 'bot' = 'bot';

    // get all copy btns in the message
    @queryAll('.code-block-header__copy')
    copyBtns: HTMLElement[];

    disconnectedCallback(): void {
        super.disconnectedCallback();

        this._removeCopyEvents();
    }

    /**
     * updated lifecycle hook: same to vue mounted or react useEffect
     * @param changedProperties
     */
    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('message')) {
            this._addCopyEvents();
        }
    }

    private _removeMessageHandler() {
        this.emit('message:remove', {
            detail: this.message,
        });
    }

    private _addCopyEvents() {
        this.copyBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const code = btn.parentElement?.nextElementSibling?.textContent;
                if (code) {
                    copyToClipboard(code).then(() => {
                        btn.textContent = 'Success';
                        setTimeout(() => {
                            btn.textContent = 'Copy';
                        }, 500);
                    });
                }
            });
        });
    }

    private _removeCopyEvents() {
        this.copyBtns.forEach((btn) => {
            btn.removeEventListener('click', () => {
                // noop
            });
        });
    }

    render() {
        return when(
            this.message.data || this.message.isThinking,
            () => html`
                <div class="cb-message-row" part="cb-message-row">
                    <!-- message -->
                    ${when(
                        this.message?.author === 'bot',
                        () => this.renderBotMessage(this.message),
                        () => this.renderUserMessage(this.message),
                    )}
                </div>
            `,
            () => null,
        );
    }

    renderButtons(direct = 'left') {
        return html`<div class="cb-message__buttons ${direct}">
            <!-- delete button -->
            <sl-icon-button
                class="cb-message__delete-button"
                name="trash"
                @click=${this._removeMessageHandler}
            ></sl-icon-button>
        </div>`;
    }

    renderMessage(type: Chatbot.MessageAuthor, message: Chatbot.Message) {
        return html`
            <div
                class="
                    cb-message__content
                    ${type}-message
                    message-type-${message.type}
                    ${message.isThinking ? 'thinking' : ''}
                    "
            >
                ${this.renderButtons(type === 'bot' ? 'right' : 'left')}
                ${this.renderMessageContent(message)}
            </div>
        `;
    }

    renderMessageContent(message: Chatbot.Message) {
        if (message.isThinking) {
            return html`<cb-thinking></cb-thinking>`;
        }
        if (message.isUploading) {
            return html`<cb-uploading
                .files="${message.data.files || []}"
            ></cb-uploading>`;
        }
        if (message.type === 'text') {
            return html`<div class="cb-message-text">
                ${parse(message.data.text!)}
            </div>`;
        }
        if (message.type === 'file') {
            return html`${repeat(
                message.data.files || [],
                (file) => file.id,
                (file) => {
                    return html`<cb-file
                        filename="${file.name}"
                        url="${file.url}"
                    ></cb-file>`;
                },
            )}`;
        }
        return html`<div class="cb-message-text">
            ${parse(message.data.text?.toString() || '')}
        </div>`;
    }

    renderBotMessage(message: Chatbot.Message) {
        return html`
            <div class="cb-message" part="cb-message">
                <sl-avatar class="avatar bot-avatar small" label="Bot">
                    <sl-icon slot="icon" name="robot"></sl-icon>
                </sl-avatar>
                ${this.renderMessage('bot', message)}
                <div class="cb-message__blank">&nbsp;</div>
            </div>
        `;
    }

    renderUserMessage(message: Chatbot.Message) {
        return html`
            <div class="cb-message" part="cb-message">
                <div class="cb-message__blank">&nbsp;</div>
                ${this.renderMessage('user', message)}
                <sl-avatar class="avatar user-avatar small" label="User">
                    <sl-icon slot="icon" name="person"></sl-icon>
                </sl-avatar>
            </div>
        `;
    }
}
