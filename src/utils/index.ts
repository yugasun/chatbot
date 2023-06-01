import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export function uuid(len = 10) {
    return nanoid(len);
}

export function copyToClipboard(text: string) {
    return new Promise((resolve, reject) => {
        try {
            navigator.clipboard.writeText(text).then(() => {
                resolve(text);
            });
        } catch (error) {
            reject(error);
        }
    });
}
