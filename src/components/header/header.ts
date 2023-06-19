import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './header.styles';
import { ChatbotElement } from '../../common/chatbot-element';

import '../common/icon/icon.js';

import BiGear from '~icons/bi/gear';
import BiXLg from '~icons/bi/x-lg';

@customElement('cb-header')
export class WpFooter extends ChatbotElement {
    static styles = styles;

    // title
    @property({ type: String, attribute: 'title' })
    title = 'ChatBot';

    render() {
        return html` <header class="cb-header" part="header">
            <span class="left">
                <sl-button
                    @click=${this._clickHandler}
                    class="cb-setting-button"
                    variant="text"
                    circle
                >
                    <cb-icon color="white" svg="${BiGear}"></cb-icon>
                </sl-button>
            </span>
            <span class="center title">${this.title}</span>
            <span class="right">
                <sl-button
                    @click=${this._clickCloseHandler}
                    class="cb-setting-button"
                    variant="text"
                    circle
                >
                    <cb-icon color="white" svg="${BiXLg}"></cb-icon>
                </sl-button>
            </span>
        </header>`;
    }

    private _clickHandler() {
        this.emit('setting:show');
    }

    private _clickCloseHandler() {
        this.emit('chatbot:toggle', {
            detail: {
                open: false,
            },
        });
    }
}
