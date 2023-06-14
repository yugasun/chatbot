import { css } from 'lit';

import componentStyles from '../../styles/component.styles';

export default css`
    ${componentStyles}
    :host {
        --primary-color: var(--sl-color-primary-600);

        --anchor-width: 50px;
    }

    .cb-anchor {
        width: var(--anchor-width);
        height: var(--anchor-width);
        background-color: var(--primary-color);

        position: fixed;
        right: 25px;
        bottom: 25px;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

        transition: all 0.3s ease-in-out;
    }

    .cb-anchor:hover {
        transform: scale(1.1);
        box-shadow: 0 0 100px rgba(0, 0, 0, 0.3);
    }

    .anchor-button {
        font-size: 1.4em;
    }
`;
