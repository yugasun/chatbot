import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './header.styles';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-header')
export class WpFooter extends ChatbotElement {
    static styles = styles;

    // title
    @property({ type: String, attribute: 'title' })
    title = 'ChatBot';

    render() {
        return html` <header class="cb-header" part="header">
            <span class="title">${this.title}</span>
            <sl-icon-button
                @click=${this._clickHandler}
                name="gear"
                label="Setting"
                class="setting-button"
            ></sl-icon-button>
        </header>`;
    }

    private _clickHandler() {
        this.emit('setting:show');
    }
}
