import ky from 'ky';

const request = ky.extend({
    hooks: {
        beforeRequest: [
            () => {
                // request.headers.set('X-Requested-With', 'ky');
            },
        ],
    },
});

interface FetchStreamParams extends RequestInit {
    onmessage?: (value: any) => void;
    onclose?: () => void;

    [key: string]: any;
}

export async function fetchStream(url: string, params: FetchStreamParams) {
    const { onmessage, onclose, ...otherParams } = params;

    const push = async (
        controller: ReadableByteStreamController,
        reader: ReadableStreamDefaultReader,
    ) => {
        const { value, done } = await reader.read();
        if (done) {
            controller.close();
            onclose?.();
        } else {
            onmessage?.(value);
            controller.enqueue(value);
            push(controller, reader);
        }
    };
    // convert object body to json string
    if (otherParams.body && typeof otherParams.body === 'object') {
        otherParams.body = JSON.stringify(otherParams.body);
    }
    return fetch(url, otherParams)
        .then((response: any) => {
            const reader = (response.body as ReadableStream).getReader();
            const stream = new ReadableStream({
                start(controller) {
                    push(
                        controller as ReadableByteStreamController,
                        reader as ReadableStreamDefaultReader,
                    );
                },
            });
            return stream;
        })
        .then((stream) =>
            new Response(stream, {
                headers: { 'Content-Type': 'text/html' },
            }).text(),
        );
}

export { request };
