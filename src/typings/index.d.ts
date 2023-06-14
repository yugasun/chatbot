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
        isThinking?: boolean;
        isUploading?: boolean;
        data: {
            text?: string;
            files?: UploadFileItem[];
        };
    }

    interface OpenAISetting {
        apiKey: string;
        maxTokens?: number;
        temperature?: number;
        topP?: number;

        [prop: string]: unknown;
    }

    interface Setting {
        model: string;
        stream: boolean;
        customRequest: boolean;
        enableUploadFile: boolean;
        uploadFileUrl: string;
        maxContextLength: number;
        openai: OpenAISetting;

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
