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

// debounce function with args
export function debounce<Fn extends (...args: any[]) => any>(
    fn: Fn,
    delay: number,
): (...args: Parameters<Fn>) => any {
    let timeoutId: number | undefined;
    return (...args: Parameters<Fn>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// throttle function with args
export function throttle<Fn extends (...args: any[]) => any>(
    fn: Fn,
    delay: number,
) {
    let lastTime = 0;
    return (...args: Parameters<Fn>) => {
        const now = Date.now();
        if (now - lastTime > delay) {
            fn(...args);
            lastTime = now;
        }
    };
}

/**
 * select file input, used for file upload
 * @param multiple
 * @returns
 */
export function selectFile(multiple = true) {
    return new Promise<File[] | undefined | null>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        // support multiple
        if (multiple) {
            input.multiple = true;
        }
        input.style.display = 'none';
        input.addEventListener('change', () => {
            const files = Array.prototype.slice.call(input.files) as File[];
            resolve(files);
        });
        input.click();
    });
}
