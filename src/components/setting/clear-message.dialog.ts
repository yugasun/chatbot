import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-clear-message-dialog')
export class ClearMessageDialog extends ChatbotElement {
    static styles = css`
        .cb-clear-message-dialog {
        }

        sl-dialog::part(base) {
            z-index: 1000;
        }
    `;

    @property({ type: Boolean })
    open = false;

    render() {
        return html` <sl-dialog
            label="Dialog"
            class="cb-clear-message-dialog"
            .open=${this.open}
        >
            Confirm to clear all history messages?
            <sl-button
                slot="footer"
                variant="primary"
                @click=${this._confirmHandler}
                >Confirm</sl-button
            >
            <sl-button
                slot="footer"
                variant="default"
                @click=${this._cancelHandler}
                >Close</sl-button
            >
        </sl-dialog>`;
    }

    private _confirmHandler() {
        this.emit('confirm');
    }

    private _cancelHandler() {
        this.emit('cancel');
    }
}
