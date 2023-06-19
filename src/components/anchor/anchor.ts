import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './anchor.styles';
import { ChatbotElement } from '../../common/chatbot-element';
import '../common/icon/icon.js';

import BiChatDotsFill from '~icons/bi/chat-dots-fill';
import BiXLg from '~icons/bi/x-lg';
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
        this.emit('chatbot:toggle', {
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
                        () =>
                            html`<cb-icon
                                color="white"
                                svg="${BiXLg}"
                            ></cb-icon>`,
                        () =>
                            html`<cb-icon
                                color="white"
                                svg="${BiChatDotsFill}"
                            ></cb-icon>`,
                    )}
                </sl-button>
            </div>
        `;
    }
}
