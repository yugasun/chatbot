import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
import markdownStyles from '../../styles/markdown.styles';

export default css`
    ${componentStyles}
    ${markdownStyles}

    .cb-message-row {
        width: 100%;
    }
    .cb-message {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 1rem 0;
    }

    .cb-message__content {
        flex: 1;
        width: 90%;
        position: relative;
        box-sizing: border-box;
    }

    .cb-message__content.thinking {
        max-width: 5rem;
    }

    .cb-message__content:hover .cb-message__buttons {
        z-index: 1;
    }

    .cb-message__content:hover .cb-message__buttons.left {
        left: -30px;
    }

    .cb-message__content:hover .cb-message__buttons.right {
        right: -30px;
    }

    .cb-message__buttons {
        position: absolute;
        height: 100%;
        top: 0;
        z-index: -1;
        transition: all 0.2s ease-in-out;
    }
    .cb-message__buttons.left {
        left: 0px;
    }
    .cb-message__buttons.left.show {
        left: -30px;
    }

    .cb-message__buttons.right {
        right: 0px;
    }
    .cb-message__buttons.right.show {
        right: -30px;
    }

    .cb-message__blank {
        flex: 1;
        max-width: 20%;
    }

    .user-avatar {
        margin-left: 0.5rem;
    }

    .bot-avatar {
        margin-right: 0.5rem;
    }

    .user-message,
    .bot-message {
        padding: 0.5rem;
        max-width: calc(100% - 120px);
        word-wrap: break-word;

        padding: 16px 20px;
        border-radius: 6px;
        font-weight: 300;
        font-size: 14px;
        line-height: 1.4;
        position: relative;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .user-message {
        color: rgb(255, 255, 255);
        background-color: var(--primary-color);
        text-align: left;
    }
    .bot-message {
        color: rgb(34, 34, 34);
        background-color: rgb(234, 234, 234);
    }

    sl-avatar.small {
        --size: 2.5rem;
    }

    .cb-message-text {
        text-align: left;
    }

    .cb-message-text p {
        padding: 0;
        margin: 0;
    }
`;
