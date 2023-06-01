import { css } from 'lit';
export default css`
    :host {
        // width: 380px;

        --label-width: 5rem;
    }

    sl-dialog.cb-dialog {
        // --width: 380px;
    }

    sl-dialog::part(base) {
        // justify-content: flex-end;
    }
    sl-dialog::part(panel) {
    }

    .form-item {
        margin-bottom: var(--sl-spacing-medium);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .form-item .label {
        width: var(--label-width);
    }

    .setting-input {
        min-width: 15rem;
    }

    .setting-input::part(form-control-input) {
        min-width: 20rem;
    }

    .setting-input + .setting-input {
        margin-top: var(--sl-spacing-medium);
    }

    .setting-input::part(form-control) {
        display: grid;
        grid: auto / var(--label-width) 1fr;
        gap: var(--sl-spacing-3x-small) var(--gap-width);
        align-items: center;
    }

    .setting-input::part(form-control-label) {
        text-align: right;
    }

    .setting-input::part(form-control-help-text) {
        grid-column-start: 2;
    }
`;
