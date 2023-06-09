import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './file.styles';
import { ChatbotElement } from '../../common/chatbot-element';
import '../common/external-link/external-link';

@customElement('cb-file')
export class FileElement extends ChatbotElement {
    static styles = styles;

    // filename property
    @property({ type: String })
    filename = '';

    // file url
    @property({ type: String })
    url = '';

    get type() {
        const unknown = 'question-square';
        if (!this.filename) {
            return unknown;
        }

        const ext = this.filename.split('.').pop();
        return ext ? `filetype-${ext.toLowerCase()}` : unknown;
    }

    render() {
        return html`
            <cb-external-link url="${this.url}" inverse>
                <div class="cb-file">
                    ${this.renderFileIcon()}
                    <span class="cb-file-name">${this.filename}</span>
                </div>
            </cb-external-link>
        `;
    }

    renderFileIcon() {
        return html`<sl-icon
            class="cb-file-icon"
            name="${this.type}"
            size="large"
        ></sl-icon> `;
    }
}
