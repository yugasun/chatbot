import { css } from 'lit';
export default css`
    :host {
        --primary-color: var(--sl-color-primary-600);
    }

    .link__item,
    .link__item:visited,
    .link__item:active {
        color: var(--primary-color);
    }

    .link__item.inverse,
    .link__item.inverse:visited,
    .link__item.inverse:active {
        color: white;
    }

    sl-button.icon {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .color-white {
        color: white;
    }

    .color-default {
        color: var(--sl-color-neutral-600);
    }

    .color-primary {
        color: var(--sl-color-primary-600);
    }

    .color-success,
    .color-green {
        color: var(--sl-color-success-600);
    }

    .color-warning {
        color: var(--sl-color-warning-600);
    }

    .color-danger,
    .color-error {
        color: var(--sl-color-danger-600);
    }

    .color-default {
        color: var(--sl-color-neutral-600);
    }

    .text-button {
        cursor: pointer;
    }

    .text-button:hover {
        text-decoration: underline;
    }
`;
