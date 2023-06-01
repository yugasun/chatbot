import componentStyles from '../../styles/component.styles';
import { css } from 'lit';

export default css`
    ${componentStyles}
    .cb-footer {
        line-height: 60px;
        font-size: 16px;
    }

    .p-2 {
        padding: 0.5rem;
    }

    .link__item {
        color: var(--primary-color);
    }
`;
