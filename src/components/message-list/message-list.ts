import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import styles from './message-list.styles';
import '../message/message';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-message-list')
export class MessageList extends ChatbotElement {
    static styles = styles;

    @property({ type: Array })
    messages: Chatbot.Message[] = [];

    render() {
        return html`
            <div class="cb-message-list" part="cb-message-list">
                ${repeat(
                    this.messages,
                    (message) => message.id + JSON.stringify(message.data),
                    (message) => {
                        return html`<cb-message
                            .message="${message}"
                        ></cb-message>`;
                    },
                )}
            </div>
        `;
    }
}
