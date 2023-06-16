import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit-html/directives/until.js';

import { ChatbotElement } from '../../common/chatbot-element';
import '../common/thinking/thinking';
import '../common/uploading/uploading';
import '../common/icon/icon';
import '../file/file';

import BiTrash from '~icons/bi/trash';
import BiPerson from '~icons/bi/person';
import BiRobot from '~icons/bi/robot';

import styles from './message.styles';
import { parse } from '../../utils/markdown';
import { copyToClipboard } from '../../utils';

@customElement('cb-message')
export class Message extends ChatbotElement {
    static styles = styles;

    @property({ type: Object })
    message: Chatbot.Message;

    @property({ type: String })
    type: Chatbot.MessageAuthor = 'assistant';

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
            requestIdleCallback(() => {
                this._addCopyEvents();
            });
        }
    }

    private get _isBot() {
        return (
            this.message.author === 'assistant' ||
            this.message.author === 'system'
        );
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
                        this._isBot,
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
            <sl-button
                class="cb-message__delete-button"
                name="trash"
                @click=${this._removeMessageHandler}
                circle
                variant="text"
                size="small"
            >
                <cb-icon svg="${BiTrash}" style="font-size: 1em"></cb-icon>
            </sl-button>
        </div>`;
    }

    renderMessage(message: Chatbot.Message) {
        return html`
            <div
                class="
                    cb-message__content
                    markdown-body
                    ${message.author}-message
                    message-type-${message.type}
                    ${message.isThinking ? 'thinking' : ''}
                    "
            >
                ${this.renderButtons(this._isBot ? 'right' : 'left')}
                ${this.renderMessageContent(message)}
            </div>
        `;
    }

    private async _getMessageText(message: Chatbot.Message) {
        return parse(message.data.text!);
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
                ${until(
                    this._getMessageText(message).then((res) => {
                        return html`${res}`;
                    }),
                )}
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
            ${until(
                parse(message.data.text?.toString() || '').then((res) => {
                    return html`${res}`;
                }),
            )}
        </div>`;
    }

    renderBotMessage(message: Chatbot.Message) {
        return html`
            <div class="cb-message" part="cb-message">
                <sl-avatar class="avatar assistant-avatar small" label="Bot">
                    <cb-icon slot="icon" svg="${BiRobot}"></cb-icon>
                </sl-avatar>
                ${this.renderMessage(message)}
                <div class="cb-message__blank">&nbsp;</div>
            </div>
        `;
    }

    renderUserMessage(message: Chatbot.Message) {
        return html`
            <div class="cb-message" part="cb-message">
                <div class="cb-message__blank">&nbsp;</div>
                ${this.renderMessage(message)}
                <sl-avatar class="avatar user-avatar small" label="User">
                    <cb-icon slot="icon" svg="${BiPerson}"></cb-icon>
                </sl-avatar>
            </div>
        `;
    }
}
