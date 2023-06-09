import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChatbotElement } from '../../../common/chatbot-element';

@customElement('cb-uploading')
export class UploadingElement extends ChatbotElement {
    static styles = css`
        .cb-uploading {
            text-align: left;
        }

        .cb-uploading__title {
            font-size: 1rem;
            display: flex;
            align-items: center;
        }

        .cb-spinner {
            font-size: 1rem;
            --indicator-color: var(--primary-color);
            --track-color: white;
            margin-right: 5px;
        }
    `;

    // file name property
    @property({ type: Object })
    files = [];

    render() {
        return html` <div class="cb-uploading">
            <div class="cb-uploading__title">
                <sl-spinner class="cb-spinner"></sl-spinner>
                <span>Uploading...</span>
            </div>
            <div class="cb-uploading__filelist">
                ${this.files.map((file: File) => {
                    return html`${file.name}<br />`;
                })}
            </div>
        </div>`;
    }
}
