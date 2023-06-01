import { PropertyValueMap, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ChatbotElement } from '../../common/chatbot-element';

import styles from './setting.styles';

@customElement('cb-setting')
export class SettingElement extends ChatbotElement {
    static styles = styles;

    @property({ type: Boolean, attribute: 'open' })
    open = false;

    @property({ type: Object })
    setting: Chatbot.Setting;

    @query('sl-dialog')
    dialog: HTMLElement;

    render() {
        return html`<sl-dialog
            label="Setting"
            class="cb-dialog"
            ?open=${this.open}
            @sl-hide=${this._settingCancelHandler}
        >
            <form>
                <sl-tab-group>
                    <sl-tab slot="nav" panel="openai">OpenAI</sl-tab>
                    <!-- TODO: support aigcaas -->
                    <sl-tab slot="nav" panel="aigcaas" disabled>AIGCaaS</sl-tab>

                    <sl-tab-panel name="openai">
                        <sl-input
                            autofocus
                            name="openai.apiKey"
                            value=${this.setting.openai.apiKey}
                            placeholder="Please input api key for openai"
                            @sl-change=${this._inputChangeHandler}
                        ></sl-input>
                    </sl-tab-panel>
                    <sl-tab-panel name="aigcaas">
                        <sl-input
                            autofocus
                            name="aigcaas.secretId"
                            value=${this.setting.aigcaas.secretId}
                            placeholder="Please input secret id for aigcaas"
                            @sl-change=${this._inputChangeHandler}
                        ></sl-input>
                        <sl-input
                            autofocus
                            name="aigcaas.secretKey"
                            value=${this.setting.aigcaas.secretKey}
                            placeholder="Please input secret key for aigcaas"
                            @sl-change=${this._inputChangeHandler}
                        ></sl-input>
                    </sl-tab-panel>
                </sl-tab-group>

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
                    <label class="label">Context</label>
                    <sl-input
                        class="item setting-input"
                        type="number"
                        name="maxContextLength"
                        value=${this.setting.maxContextLength}
                        placeholder="Number of consecutive sessions"
                    ></sl-input>
                </div>
            </form>

            <sl-button
                slot="footer"
                variant="primary"
                @click=${this._settingConfirmHandler}
            >
                Confirm
            </sl-button>
            <sl-button
                slot="footer"
                variant="default"
                @click=${this._settingCancelHandler}
                >Cancel</sl-button
            >
        </sl-dialog>`;
    }

    // input change handler
    _inputChangeHandler(e: Event) {
        const { name, value } = e.target as HTMLInputElement;
        const [key, subKey] = name.split('.') as [Chatbot.SettingKey, string];
        if (subKey) {
            this.setting[key][subKey] = value;
        } else {
            this.setting[key] = value;
        }
    }

    // checked change handler
    _checkChangeHandler(e: Event) {
        const { name, checked } = e.target as HTMLInputElement;
        const [key, subKey] = name.split('.') as [Chatbot.SettingKey, string];
        if (subKey) {
            this.setting[key][subKey] = checked;
        } else {
            this.setting[key] = checked;
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
