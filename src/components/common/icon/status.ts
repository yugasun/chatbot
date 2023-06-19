import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { ChatbotElement } from '../../../common/chatbot-element';
import './icon';

import styles from './icon.styles';

import ErrorIcon from '~icons/bi/exclamation-octagon';
import WarnIcon from '~icons/bi/exclamation-triangle';
import SuccessIcon from '~icons/bi/check2-circle';
import InfoIcon from '~icons/bi/info-circle';

type MessageType = 'error' | 'warning' | 'success' | 'info' | 'danger';

const icons: Record<
    MessageType,
    {
        icon: string;
        variant: string;
    }
> = {
    error: {
        variant: 'danger',
        icon: ErrorIcon,
    },
    danger: {
        variant: 'danger',
        icon: ErrorIcon,
    },
    warning: {
        variant: 'warning',
        icon: WarnIcon,
    },
    success: {
        variant: 'success',
        icon: SuccessIcon,
    },
    info: {
        variant: 'primary',
        icon: InfoIcon,
    },
};

@customElement('cb-status-icon')
export class StatusIcon extends ChatbotElement {
    static styles = styles;

    // status type
    @property({ type: String })
    status: MessageType = 'info';

    render() {
        const { variant, icon } = icons[this.status] || icons.info;
        return html`<cb-icon svg=${icon} color="${variant}"></cb-icon>`;
    }
}
