import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './footer.styles';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-footer')
export class WpFooter extends ChatbotElement {
    static styles = styles;

    year = new Date().getFullYear();
    render() {
        return html`
            <div class="cb-footer" part="footer">
                yugasun@${this.year}
                <a
                    class="link__item underline"
                    href="https://github.com/yugasun/chatbot"
                    target="_blank"
                >
                    Github
                </a>
                <span class="p-2"> | </span>
                <a
                    class="link__item underline"
                    href="https://lit.dev/"
                    target="_blank"
                >
                    Lit
                </a>
                <span class="p-2"> | </span>
                <a
                    class="link__item underline"
                    href="https://vitejs.dev"
                    target="_blank"
                >
                    Vite
                </a>
            </div>
        `;
    }
}
