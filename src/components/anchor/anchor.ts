import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './anchor.styles';
import { ChatbotElement } from '../../common/chatbot-element';
import '../common/icon/icon.js';

import RiMessage2Line from '~icons/ri/message-2-line';
import RiCloseFill from '~icons/ri/close-fill';
import { when } from 'lit/directives/when.js';

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
                <sl-button
                    label="Start"
                    size="large"
                    variant="primary"
                    class="icon anchor-button"
                    circle
                >
                    ${when(
                        this.open,
                        () => html`<cb-icon svg="${RiCloseFill}"></cb-icon>`,
                        () => html`<cb-icon svg="${RiMessage2Line}"></cb-icon>`,
                    )}
                </sl-button>
            </div>
        `;
    }
}
