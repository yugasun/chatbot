import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './anchor.styles';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-anchor')
export class AnchorElement extends ChatbotElement {
    static styles = styles;

    // open flag
    @property({ type: Boolean })
    open = false;

    // handler click
    private _clickHandler() {
        const isOpen = this.open ? false : true;
        this.emit('toggle:open', {
            detail: {
                open: isOpen,
            },
        });

        this.open = isOpen;
    }

    render() {
        return html`
            <div
                class="cb-anchor ${this.open ? 'open' : ''}"
                part="cb-anchor"
                @click=${this._clickHandler.bind(this)}
            >
                <sl-icon-button
                    name="${this.open ? 'x-lg' : 'chat-left-dots'}"
                    label="Start"
                    size="large"
                    class="anchor-button"
                ></sl-icon-button>
            </div>
        `;
    }
}
