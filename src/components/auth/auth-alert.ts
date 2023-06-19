import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ChatbotElement } from '../../common/chatbot-element';
import '../common/icon/icon';
import styles from './styles';

import '../common/icon/status';

@customElement('cb-auth-alert')
export class AuthNotify extends ChatbotElement {
    static styles = styles;

    render() {
        return html` <sl-alert variant="danger" open>
            <cb-status-icon status="error" slot="icon"></cb-status-icon>
            Please config openai api key in the settings.
            <span
                @click="${this._handleConfig}"
                class="color-primary text-button"
                >Config Now</span
            >
        </sl-alert>`;
    }

    private _handleConfig() {
        this.emit('setting:show');
    }
}
