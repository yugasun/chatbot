import { ChatbotElement } from '@/common/chatbot-element';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import BiXLg from '~icons/bi/x-lg';

import styles from './dialog.styles';

@customElement('cb-dialog')
export class Dialog extends ChatbotElement {
    static styles = styles;

    // open flag
    @property({ type: Boolean })
    open = false;

    // label
    @property({ type: String, attribute: 'label' })
    label = 'Dialog';

    // zindex
    @property({ type: Number })
    zindex = 100;

    private _settingCancelHandler() {
        this.emit('cancel');
    }

    render() {
        return html` <sl-dialog
            label="Setting"
            class="cb-dialog"
            style="sl-dialog::part(base) { z-index: ${this.zindex}; }"
            ?open=${this.open}
            ?no-header=${true}
            @sl-hide=${this._settingCancelHandler}
        >
            <header class="cb-header">
                <div class="cb-header__left">
                    ${this.label
                        ? html`<span class="title">${this.label}</span>`
                        : ''}
                </div>
                <sl-button
                    @click=${this._settingCancelHandler}
                    name="close"
                    label="Close"
                    class="close-button"
                    variant="text"
                    circle
                >
                    <cb-icon
                        color="default"
                        style="font-size: 1em;"
                        svg="${BiXLg}"
                    ></cb-icon>
                </sl-button>
            </header>
            <div class="cb-dialog__body">
                <slot></slot>
            </div>
            <div part="footer" class="cb-dialog__footer">
                <slot name="cb-footer"></slot>
            </div>
        </sl-dialog>`;
    }
}
