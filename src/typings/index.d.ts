/// <reference types="unplugin-icons/types/raw" />
declare namespace Chatbot {
    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

    type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'emoji';
    type MessageAuthor = 'user' | 'assistant' | 'system';

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
        timestamp: number;
        author: MessageAuthor;
        type: MessageType;
        // bot reply message id (user message id)
        replyId?: string;
        isThinking?: boolean;
        isUploading?: boolean;
        data: {
            text?: string;
            files?: UploadFileItem[];
        };
    }

    type NewMessage = PartialBy<Message, 'id' | 'timestamp'>;

    interface OpenAISetting {
        apiBase: string;
        apiKey: string;
        model?: string;
        maxTokens?: number;
        temperature?: number;
        topP?: number;

        [prop: string]: unknown;
    }

    interface Setting {
        // llm model, default: gpt-3.5-turbo
        model: string;
        // stream mode, default: false
        stream: boolean;
        // custom request, default: false
        customRequest: boolean;
        // enable upload file, default: false
        enableUploadFile: boolean;
        // upload file url
        uploadFileUrl: string;
        // whether use context, default: false
        useContext: boolean;
        // max context length, default: 20
        maxContextLength: number;
        // openai setting
        openai: OpenAISetting;

        // extra fields
        [prop: string]: any;
    }

    type SettingKey = keyof Setting;

    // upload file item
    interface UploadFileItem {
        id: string;
        // filename
        name: string;
        // file url
        url: string;
    }

    // upload file response
    interface UploadFileResponse {
        // response code: 0 success, 1 error
        code: number;
        // upload file url
        url: string;
        // error message
        message: string;

        data?: UploadFileItem[];

        // extra fields
        [prop: string]: unknown;
    }
}
