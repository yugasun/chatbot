import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChatbotElement } from '../../common/chatbot-element';

import '../common/dialog/dialog.js';

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
        return html` <cb-dialog
            label="Confirm"
            class="cb-clear-message-dialog"
            ?open=${this.open}
            zindex="1000"
            @cancel=${this._cancelHandler}
        >
            Confirm to clear all history messages?
            <sl-button
                slot="cb-footer"
                variant="primary"
                @click=${this._confirmHandler}
                >Confirm</sl-button
            >
            <sl-button
                slot="cb-footer"
                variant="default"
                @click=${this._cancelHandler}
                >Close</sl-button
            >
        </cb-dialog>`;
    }

    private _confirmHandler() {
        this.emit('confirm');
    }

    private _cancelHandler() {
        this.emit('cancel');
    }
}
