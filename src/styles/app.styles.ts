import { css } from 'lit';

export default css`
    :host {
    }
    .cb-wrapper {
        color: var(--sl-color-neutral-600);
        width: 380px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        border-radius: 6px;

        height: calc(100% - 120px);
        max-height: 590px;
        position: fixed;
        right: 25px;
        bottom: 100px;
        background: rgb(255, 255, 255);
        overflow: hidden;

        box-shadow: rgba(148, 149, 150, 0.2) 20px 20px 40px 20px;

        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            display: none;
        }
        to {
            opacity: 1;
            display: block;
        }
    }

    @media (max-width: 450px) {
        .cb-wrapper {
            width: 100%;
            height: 100%;
            max-height: 100%;
            right: 0;
            bottom: 0;
            border-radius: 0;
        }
    }
`;
