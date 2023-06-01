import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import styles from './user-input.styles';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-user-input')
export class UserInput extends ChatbotElement {
    static styles = styles;

    @property({ type: String, attribute: 'placeholder' })
    placeholder = 'Type a message...';

    @property({ type: String, attribute: 'send-button-label' })
    sendButtonLabel = 'Send';

    // property value
    @property({ type: String })
    value = '';

    // loading flag
    @property({ type: Boolean })
    loading = false;

    // current key
    @property({ type: String })
    currentKey = '';

    // input element
    @query('sl-textarea')
    inputElement: HTMLInputElement;

    private _inputChangeHandler(event: CustomEvent) {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
    }

    private _sendHandler() {
        this.emit('message:send', {
            detail: {
                author: 'user',
                type: 'text',
                data: {
                    text: this.value,
                },
            },
        });

        // reset value
        this.value = '';
        this.inputElement.blur();
    }

    render() {
        return html`
            <div class="user-input-wrapper" part="user-input-wrapper">
                <sl-textarea
                    @sl-input=${this._inputChangeHandler}
                    placeholder=${this.placeholder}
                    class="user-input"
                    clearable="true"
                    value=${this.value}
                    rows="1"
                    resize="auto"
                    filled
                    enterkeyhint="send"
                    @keydown=${this._keyDownHandler}
                ></sl-textarea>
                <sl-icon-button
                    @click=${this._sendHandler}
                    name="send"
                    label="Edit"
                    size="large"
                    class="send-button"
                ></sl-icon-button>
            </div>
        `;
    }

    private _keyDownHandler(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            this._sendHandler();
        }
    }
}
