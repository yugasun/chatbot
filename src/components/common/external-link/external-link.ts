import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cb-external-link')
export class ExternalLink extends LitElement {
    static styles = css`
        :host {
            --primary-color: var(--sl-color-primary-600);
        }

        .cb-external-link {
            display: inline-block;
        }

        .link__item,
        .link__item:visited,
        .link__item:active {
            color: var(--primary-color);
        }

        .link__item.inverse,
        .link__item.inverse:visited,
        .link__item.inverse:active {
            color: white;
        }

        .cb-external-link:hover {
            text-decoration: underline;
        }
    `;

    // url property
    @property({ type: String })
    url = '';

    // inverse
    @property({ type: Boolean })
    inverse = false;

    render() {
        return html`
            <a
                class="
                    cb-external-link link__item
                    ${this.inverse ? 'inverse' : ''}}
                "
                href="${this.url}"
                target="__blank"
                reference="noopener noreferrer"
            >
                <slot></slot>
            </a>
        `;
    }
}
