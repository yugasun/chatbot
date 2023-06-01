import { TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './message-list.styles';
import '../message/message';
import { ChatbotElement } from '../../common/chatbot-element';

@customElement('cb-message-list')
export class MessageList extends ChatbotElement {
    static styles = styles;

    @property({ type: Array, attribute: true })
    messages: Chatbot.Message[] = [];

    render() {
        const msgNodes: TemplateResult[] = [];
        this.messages.forEach((message) => {
            msgNodes.push(
                html`<cb-message .message="${message}"></cb-message>`,
            );
        });

        return html`
            <div class="cb-message-list" part="cb-message-list">
                ${msgNodes}
            </div>
        `;
    }
}
