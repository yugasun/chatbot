import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import styles from './icon.styles';

@customElement('cb-icon')
export class Icon extends LitElement {
    static styles = styles;

    // color
    @property({ type: String })
    color = 'primary';

    // svg string
    @property({ type: String })
    svg = '';

    render() {
        return html`<span class="cb-icon color-${this.color}" part="base"
            >${unsafeHTML(this.svg)}</span
        >`;
    }
}
