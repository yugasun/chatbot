import { css } from 'lit';
export default css`
    :host {
        --primary-color: var(--sl-color-primary-600);
    }

    .cb-anchor {
        width: 40px;
        height: 40px;
        background-color: var(--primary-color);

        position: fixed;
        right: 25px;
        bottom: 25px;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
        color: white;

        transition: all 0.3s ease-in-out;
    }

    .cb-anchor:hover {
        transform: scale(1.1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    .cb-anchor sl-icon-button::part(base) {
        color: white;
        font-weight: bold;
    }

    .cb-anchor sl-icon-button::part(base):hover,
    .cb-anchor sl-icon-button::part(base):focus {
        opacity: 0.8;
    }
`;
