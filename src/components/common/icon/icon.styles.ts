import componentStyles from '@/styles/component.styles';
import { css } from 'lit';
export default css`
    ${componentStyles}

    :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: sub;
        font-size: 1.2rem;
    }

    .cb-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: sub;
        font-size: 1.2rem;
    }

    .color-white {
        color: white;
    }
`;
