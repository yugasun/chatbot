import componentStyles from '../../styles/component.styles';
import { css } from 'lit';

export default css`
    ${componentStyles}

    :host {
        width: 100%;
        background: rgb(244, 247, 249);
        position: relative;
        padding: 6px 5px;
        box-sizing: border-box;
        border-radius-bottom-left: 6px;
        border-radius-bottom-right: 6px;
    }

    .user-input-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .user-input {
        flex: 1;
    }

    .send-button {
        font-size: 1.5rem;
    }

    .paperclip-button {
        font-size: 1.5rem;
        position: relative;
    }

    .file-input {
        visibility: hidden;
        width: 100%;
        height: 100%;
        position: absolute;
    }
`;
