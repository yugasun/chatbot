import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './file.styles';
import { ChatbotElement } from '../../common/chatbot-element';
import '../common/external-link/external-link';

import '../common/icon/icon.js';

import BiFiletypeTxt from '~icons/bi/filetype-txt';
import BiFiletypePdf from '~icons/bi/filetype-pdf';
import BiFiletypeMd from '~icons/bi/filetype-md';
import BiFiletypeCsv from '~icons/bi/filetype-csv';
import BiFiletypePpt from '~icons/bi/filetype-ppt';
import BiFiletypeDoc from '~icons/bi/filetype-doc';
import BiFiletypeDocx from '~icons/bi/filetype-docx';

const fileIconMap: Record<string, any> = {
    pdf: BiFiletypePdf,
    txt: BiFiletypeTxt,
    md: BiFiletypeMd,
    csv: BiFiletypeCsv,
    ppd: BiFiletypePpt,
    doc: BiFiletypeDoc,
    docx: BiFiletypeDocx,
};

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
        const unknown = 'txt';
        if (!this.filename) {
            return unknown;
        }

        const ext = this.filename.split('.').pop();
        return ext ? ext.toLowerCase() : unknown;
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
        return html`
            <cb-icon
                class="cb-file-icon"
                svg="${fileIconMap[this.type] || fileIconMap['txt']}"
            ></cb-icon>
        `;
    }
}
