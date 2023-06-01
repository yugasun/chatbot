import { State, property, storage } from '@lit-app/state';
import { uuid } from '../utils';

const LS_KEY_PREFIX = 'cb_';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

class AppState extends State {
    // app language
    @storage({ prefix: LS_KEY_PREFIX })
    @property({ value: 'en' })
    language: string;

    // app theme
    @storage({ prefix: LS_KEY_PREFIX })
    @property({ value: 'light' })
    theme: string;

    // app messages
    @storage({ prefix: LS_KEY_PREFIX })
    @property({ type: Array, value: [] })
    messages: Chatbot.Message[];

    // setting
    @storage({ prefix: LS_KEY_PREFIX })
    @property({
        type: Object,
        value: {
            stream: false,
            maxContextLength: 20,
            openai: {
                apiKey: '',
            },
            aigcaas: {
                secretId: '',
                secretKey: '',
            },
        },
    })
    setting: Chatbot.Setting;

    // set setting
    setSetting(setting: Chatbot.Setting) {
        this.setting = setting;
    }

    // set language
    setLanguage(language: string) {
        this.language = language;
    }

    // set theme
    setTheme(theme: string) {
        this.theme = theme;
    }

    // add message
    addMessage(message: PartialBy<Chatbot.Message, 'id'>) {
        if (!message.id) {
            message.id = uuid();
        }
        this.messages = [...this.messages, message as Chatbot.Message];
    }

    // update message
    updateMessage(message: Chatbot.Message) {
        this.messages = this.messages.map((m) => {
            if (m.id === message.id) {
                return message;
            }
            return m;
        });
    }

    // remove message
    removeMessage(id: string) {
        this.messages = this.messages.filter((message) => message.id !== id);
    }

    // clear messages
    clearMessage() {
        this.messages = [];
    }
}

export const appState = new AppState();
