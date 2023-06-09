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
`;
