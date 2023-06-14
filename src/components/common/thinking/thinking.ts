import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('cb-thinking')
export class ThinkingElement extends LitElement {
    static styles = css`
        .cb-thinking {
            text-align: center;
        }

        .cb-thinking span {
            display: inline-block;
            background-color: #b6b5ba;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            margin-right: 3px;
            animation: jump 2s infinite;
        }

        .cb-thinking span:first-child {
            animation-delay: -1s;
        }

        .cb-thinking span:nth-child(2) {
            animation-delay: -0.85s;
        }

        .cb-thinking span:nth-child(3) {
            animation-delay: -0.7s;
        }

        @keyframes jump {
            10% {
                transform: translateY(-10px);
                opacity: 0.9;
            }
            50% {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;

    render() {
        return html` <div
            class="cb-thinking"
            style="color: rgb(34, 34, 34); background-color: rgb(234, 234, 234);"
        >
            <span></span><span></span><span></span>
        </div>`;
    }
}
