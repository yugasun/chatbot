import componentStyles from '../../styles/component.styles';
import { css } from 'lit';

export default css`
    ${componentStyles}
    :host {
        position: relative;
        font-weight: bold;
        font-size: 2rem;
        line-height: 2rem;
        padding: 10px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
        width: 100%;
        text-align: center;
        color: rgba(255, 255, 255, 1);
        border-radius-top-left: 6px;
        border-radius-top-right: 6px;
        top: 0;
        box-sizing: border-box;

        background: var(--primary-color);

        // position: fixed;
        // z-index: 100;
        // top: 0;
    }

    .cb-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .title {
        justify-items: center;
    }

    .cb-setting-button {
        font-size: 1.5rem;
        color: white;
    }
`;
