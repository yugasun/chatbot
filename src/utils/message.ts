import type { SlAlert } from '@shoelace-style/shoelace';

import '../components/common/icon/status';

import ErrorIcon from '~icons/bi/exclamation-octagon';
import WarnIcon from '~icons/bi/exclamation-triangle';
import SuccessIcon from '~icons/bi/check2-circle';
import InfoIcon from '~icons/bi/info-circle';

type MessageType = 'error' | 'warning' | 'success' | 'info';

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

// Always escape HTML for text arguments!
function escapeHtml(html: string) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// Custom function to emit toast notifications
export function notify(
    type: MessageType = 'info',
    message: string,
    duration = 100000000,
) {
    const { variant, icon } = icons[type] || icons.info;
    const alert = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: true,
        duration: duration,
        innerHTML: `
        <cb-status-icon slot="icon" status="${type}"></cb-status-icon>
        ${escapeHtml(message)}
      `,
    }) as SlAlert;

    document.body.append(alert);
    return alert.toast();
}
