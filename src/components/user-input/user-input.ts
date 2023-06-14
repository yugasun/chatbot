import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import styles from './user-input.styles';
import { ChatbotElement } from '../../common/chatbot-element';
import { selectFile } from '../../utils';

import '../common/icon/icon.js';

import BiSend from '~icons/bi/send';
import BiPaperclip from '~icons/bi/paperclip';

@customElement('cb-user-input')
export class UserInput extends ChatbotElement {
    static styles = styles;

    @property({ type: String, attribute: 'placeholder' })
    placeholder = 'Type a message...';

    @property({ type: String, attribute: 'send-button-label' })
    sendButtonLabel = 'Send';

    // enable file upload
    @property({ type: Boolean, attribute: 'enable-file-upload' })
    enableFileUpload = false;

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

    private async _sendFileHandler() {
        const files = await selectFile();

        this.emit('message:send:file', {
            detail: {
                files,
            },
        });
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

                ${when(
                    this.enableFileUpload,
                    () => html`
                        <sl-button
                            @click=${this._sendFileHandler}
                            name="paperclip"
                            label="Attachment"
                            size="large"
                            class="paperclip-button"
                            variant="text"
                            circle
                        >
                            <cb-icon svg="${BiPaperclip}"></cb-icon>
                            <!-- select file input -->
                            <input
                                type="file"
                                id="file"
                                name="file"
                                class="file-input"
                            />
                        </sl-button>
                    `,
                    () => html``,
                )}
                <sl-button
                    @click=${this._sendHandler}
                    name="send"
                    label="Send"
                    size="small"
                    class="send-button"
                    variant="text"
                    ?disabled=${this.value.length === 0}
                    ?loading=${this.loading}
                    circle
                >
                    <cb-icon svg="${BiSend}"></cb-icon>
                </sl-button>
            </div>
        `;
    }

    private _keyDownHandler(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            this._sendHandler();
        }
    }
}
