import { request } from '../utils/request';

// const baseUrl = 'https://api.openai.com/v1';
const baseUrl = '';

function getFullUrl(path: string) {
    return `${baseUrl}${path}`;
}

async function parseOpenaiResponse(
    data: ReadableStream<Uint8Array>,
    callback: Chatbot.MessageCallback,
) {
    const reader = data.getReader();
    const decoder = new TextDecoder('utf-8');

    let done = false;

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
            let char = decoder.decode(value);
            const startIndex = char.lastIndexOf('data:');
            const lastIndex = char.lastIndexOf('\n');
            if (startIndex !== -1) {
                char = char.slice(startIndex + 6);
            }
            if (lastIndex !== -1) {
                char = char.slice(0, lastIndex);
            }
            char = char.trim();

            if (char === '\n' || char === '') {
                continue;
            }

            if (char === '[DONE]') {
                done = true;
                continue;
            }

            try {
                const json = JSON.parse(char) as Chatbot.OpenaiResponse;
                callback(null, json);
            } catch (error: Error | any) {
                console.log('error', error);
                callback(error, null);
            }
        }
        done = readerDone;
    }
}

export async function chat(params: {
    apiKey: string;
    messages: Chatbot.OpenaiMessage[];
    options: Record<string, any>;
    signal?: AbortSignal;
    onMessage?: Chatbot.MessageCallback;
}): Promise<Chatbot.OpenaiResponse | void> {
    if (!params.apiKey) {
        throw new Error('apiKey is required');
    }
    const response = await request.post(
        getFullUrl('/aigcaas/chat/completions'),
        {
            json: {
                messages: params.messages,
                ...(params.options ?? {}),
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${params.apiKey}`,
            },
            timeout: 1000 * 60 * 10,
            signal: params.signal,
        },
    );

    const data = response.body;
    if (!data) {
        throw new Error('No data');
    }

    if (params.options?.stream) {
        await parseOpenaiResponse(data, params.onMessage!);
        return;
    }
    return response.json();
}
