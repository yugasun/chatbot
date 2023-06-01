declare namespace Chatbot {
    type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'emoji';
    type MessageAuthor = 'user' | 'bot';

    interface OpenaiMessage {
        role: 'user' | 'system' | 'assistant';
        content: string;
    }

    type MessageCallback = (
        err: null | Error,
        data: null | OpenaiResponse,
    ) => void;

    interface OpenaiResponse {
        // conversation id: chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6
        id: string;
        // chat.completion.chunk
        object: string;
        // timestamp
        created: number;
        // gpt-3.5-turbo-0301
        model: string;
        choices: [
            {
                delta: { content: string };
                index: number;
                message: OpenaiMessage;
                finish_reason: null | string;
            },
        ];
    }
    interface Message {
        id: string;
        author: MessageAuthor;
        type: MessageType;
        data: Record<string, string>;
    }

    interface OpenAISetting {
        apiKey: string;
        maxTokens?: number;
        temperature?: number;
        topP?: number;

        [prop: string]: any;
    }

    interface AigcaasSetting {
        secretId: string;
        secretKey: string;
    }

    interface Setting {
        stream: boolean;
        maxContextLength: number;
        openai: OpenAISetting;
        aigcaas: AigcaasSetting;

        [prop: string]: any;
    }

    type SettingKey = keyof Setting;
}
