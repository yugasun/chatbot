import { html } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { ChatbotElement } from '../../common/chatbot-element';
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
        return this.message.data?.text
            ? html`
                  <div class="cb-message-row" part="cb-message-row">
                      <!-- message -->
                      ${this.message?.author === 'bot'
                          ? this.renderBotMessage(this.message)
                          : this.renderUserMessage(this.message)}
                  </div>
              `
            : '';
    }

    renderButtons(direct = 'left') {
        return html` <div class="cb-message__buttons ${direct}">
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
            <p class="cb-message__content ${type}-message markdown-body">
                ${this.renderButtons(type === 'bot' ? 'right' : 'left')}
                ${parse(message.data.text)}
            </p>
        `;
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
