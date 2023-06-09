import { css } from 'lit';
import componentStyles from '../../styles/component.styles';

export default css`
    ${componentStyles}
    :host {
    }

    .cb-file {
        width: 100%;
        border-radius: 0.2rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 1;
        color: white;
    }

    .cb-file-icon {
        font-size: 2em;
        margin-right: 0.2em;
    }
`;
