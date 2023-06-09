import { request } from '../utils/request';

// upload file to server
export async function uploadFile(
    url: string,
    files: File[],
): Promise<Chatbot.UploadFileResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const response = await request.post(url, {
        body: formData,
    });

    try {
        const res = await response.json();
        return res as Chatbot.UploadFileResponse;
    } catch (error) {
        return {
            code: 1,
            url: '',
            message: (error as Error).message,
        };
    }
}
