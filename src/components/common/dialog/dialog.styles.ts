import { css } from 'lit';
import componentStyles from '@/styles/component.styles';

export default css`
    ${componentStyles}

    sl-dialog::part(base) {
        z-index: 1000;
    }

    .cb-header {
        display: flex;
        padding: 0px 0px 20px 0px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .cb-header .title {
        font-weight: bold;
        font-size: 1.3rem;
    }

    .cb-dialog__body {
        flex: 1 1 auto;
        display: block;
        padding: var(--body-spacing) 0;
        overflow: auto;
    }

    .cb-dialog__footer {
        display: flex;
        padding: var(--body-spacing) 0;
        overflow: auto;
        justify-content: flex-end;
        gap: 8px;
    }
`;
