import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

@customElement('cb-icon')
export class Icon extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            vertical-align: sub;
            font-size: 1.2rem;
        }

        .color-white {
            color: white;
        }

        .color-default {
            color: var(--sl-color-neutral-600);
        }
    `;

    // color
    @property({ type: String })
    color = 'primary';

    // svg string
    @property({ type: String })
    svg = '';

    render() {
        return html`<span class="cb-icon color-${this.color}"
            >${unsafeHTML(this.svg)}</span
        >`;
    }
}
