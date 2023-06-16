import { State, property, storage } from '@lit-app/state';
import { uuid } from '../utils';

const LS_KEY_PREFIX = 'cb_';

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
            useContext: false,
            maxContextLength: 20,
            customRequest: false,
            uploadFileUrl: '',
            openai: {
                model: 'gpt-3.5-turbo',
                apiBase: 'https://api.openai.com/v1',
                apiKey: '',
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

    formatMessage(message: Chatbot.NewMessage): Chatbot.Message {
        if (!message.id) {
            message.id = uuid();
        }
        // init message timestamp
        message.timestamp = Date.now();
        // init message replay id for assistant reply
        if (message.author === 'assistant') {
            // use last message id as reply id
            message.replyId = this.messages[this.messages.length - 1]?.id;
        }
        return message as Chatbot.Message;
    }

    // add message
    addMessage(message: Chatbot.NewMessage) {
        message = this.formatMessage(message);

        this.messages = [...this.messages, message as Chatbot.Message];
    }

    // update message
    updateMessage(message: Chatbot.NewMessage, text?: string) {
        const newMsg = this.formatMessage(message);
        newMsg.isThinking = false;
        if (text) {
            newMsg.data.text = text;
        }
        this.messages = this.messages.map((m) => {
            if (m.id === newMsg.id) {
                return newMsg;
            }
            return m;
        });
    }

    // remove message
    removeMessage(id: string) {
        this.messages = this.messages.filter((message) => message.id !== id);
    }

    // clear messages
    clearMessages() {
        this.messages = [];
    }
}

export const appState = new AppState();
