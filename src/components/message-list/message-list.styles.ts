import componentStyles from '../../styles/component.styles';
import { css } from 'lit';
export default css`
    ${componentStyles}

    :host {
        width: 100%;
        height: 80%;
        box-sizing: border-box;
        overflow-y: auto;
        background-size: 100%;
        padding: 40px 10px;
        box-sizing: border-box;
    }
`;
