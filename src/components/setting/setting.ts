import { PropertyValueMap, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ChatbotElement } from '../../common/chatbot-element';
import './clear-message.dialog';

import '../common/icon/icon.js';

import styles from './setting.styles';

@customElement('cb-setting')
export class SettingElement extends ChatbotElement {
    static styles = styles;

    @property({ type: Boolean })
    open = false;

    @property({ type: Object })
    setting: Chatbot.Setting;

    // control clear message dialog flag
    @property({ type: Boolean })
    clearMessageDialogOpen = false;

    @query('sl-dialog')
    dialog: HTMLElement;

    // enable custom request
    @property({ type: Boolean })
    customRequest = false;

    render() {
        this.customRequest = this.setting.customRequest;

        return html`
            <cb-dialog
                label="Setting"
                class="cb-dialog"
                ?open=${this.open}
                ?no-header=${true}
                @cancel=${this._settingCancelHandler}
            >
                <form>
                    <div class="form-item">
                        <label class="label">Clear Cache</label>
                        <sl-button
                            variant="danger"
                            size="small"
                            @click=${() => {
                                this.clearMessageDialogOpen = true;
                            }}
                        >
                            Clear
                        </sl-button>
                    </div>
                    <div class="form-item">
                        <label class="label"> Custom Request </label>

                        <sl-switch
                            class="item"
                            label="Custom Request"
                            name="customRequest"
                            ?checked="${this.customRequest}"
                            @sl-change=${this._checkChangeHandler}
                        >
                            Enable it for your own backend.
                        </sl-switch>
                    </div>
                    ${this.renderInternalServices(this.customRequest)}

                    <div class="form-item">
                        <label class="label">Streaming</label>
                        <sl-switch
                            class="item"
                            label="Stream"
                            name="stream"
                            ?checked="${this.setting.stream}"
                            @sl-change=${this._checkChangeHandler}
                        ></sl-switch>
                    </div>
                    <div class="form-item">
                        <label class="label">Use Context</label>
                        <sl-switch
                            class="item"
                            label="Use Context"
                            name="useContext"
                            ?checked="${this.setting.useContext}"
                            @sl-change=${this._checkChangeHandler}
                        ></sl-switch>
                        <!-- <sl-input
                            size="small"
                            type="number"
                            name="maxContextLength"
                            value=${this.setting.maxContextLength}
                            placeholder="Number of consecutive sessions"
                        ></sl-input> -->
                    </div>
                </form>

                <sl-button
                    slot="cb-footer"
                    variant="primary"
                    @click=${this._settingConfirmHandler}
                >
                    Confirm
                </sl-button>
                <sl-button
                    slot="cb-footer"
                    variant="default"
                    @click=${this._settingCancelHandler}
                    >Cancel</sl-button
                >
            </cb-dialog>
            <cb-clear-message-dialog
                .open=${this.clearMessageDialogOpen}
                @confirm=${this._clearCacheHandler}
                @cancel=${() => {
                    this.clearMessageDialogOpen = false;
                }}
            ></cb-clear-message-dialog>
        `;
    }

    renderInternalServices(isCustomRequest = false) {
        return html`
            <div class="form-item">
                <label class="label">Service</label>
                <sl-radio-group name="openai" value="openai" size="small">
                    <sl-radio-button value="openai">OpenAI</sl-radio-button>
                </sl-radio-group>
            </div>
            ${when(
                isCustomRequest,
                () => null,
                () => html` <div class="form-item">
                    <label class="label">API Key</label>
                    <sl-input
                        autofocus
                        size="small"
                        name="openai.apiKey"
                        value=${this.setting.openai.apiKey}
                        placeholder="Please input api key for openai"
                        @sl-change=${this._inputChangeHandler}
                    ></sl-input>
                </div>`,
            )}

            <div class="form-item">
                <label class="label">API Base</label>
                <sl-input
                    autofocus
                    size="small"
                    name="openai.apiBase"
                    value=${this.setting.openai.apiBase}
                    placeholder="Please input api base for openai"
                    @sl-change=${this._inputChangeHandler}
                ></sl-input>
            </div>
            <div class="form-item">
                <label class="label">Model</label>
                <sl-input
                    autofocus
                    size="small"
                    name="openai.model"
                    value=${this.setting.openai.model}
                    placeholder="Please input model for openai"
                    @sl-change=${this._inputChangeHandler}
                ></sl-input>
            </div>
        `;
    }

    // clear message cache handler
    private _clearCacheHandler() {
        this.emit('message:clear');

        this.clearMessageDialogOpen = false;
    }

    // input change handler
    private _inputChangeHandler(e: Event) {
        const { name, value } = e.target as HTMLInputElement;
        const [key, subKey] = name.split('.') as [Chatbot.SettingKey, string];
        if (subKey) {
            this.setting[key][subKey] = value;
        } else {
            this.setting[key] = value;
        }
    }

    // checked change handler
    private _checkChangeHandler(e: Event) {
        const { name, checked } = e.target as HTMLInputElement;
        const [key, subKey] = name.split('.') as [Chatbot.SettingKey, string];
        if (subKey) {
            this.setting[key][subKey] = checked;
        } else {
            this.setting[key] = checked;
        }

        if (key === 'customRequest') {
            this.customRequest = checked;
        }
    }

    // emit setting confirm event
    private _settingConfirmHandler() {
        // this.showSetting = !this.showSetting;
        this.emit('setting:confirm', {
            detail: {
                setting: this.setting,
            },
        });
    }

    // emit setting cancel event
    private _settingCancelHandler() {
        this.emit('setting:hide');
    }

    protected updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
    ): void {
        super.updated(_changedProperties);

        // prevent close dialog when click overlay
        this.dialog?.addEventListener('sl-request-close', (event) => {
            if ((event as CustomEvent).detail.source === 'overlay') {
                event.preventDefault();
            }
        });
    }
}
