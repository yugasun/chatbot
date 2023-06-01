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

export { request };
