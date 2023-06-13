import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';
import replace from '@rollup/plugin-replace';
import { createHtmlPlugin } from 'vite-plugin-html';
import ViteInspector from 'vite-plugin-inspect';
// import Unocss from 'unocss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export const icons = [
    'chat-left-dots',
    'x-lg',
    'gear',
    'person',
    'robot',
    'paperclip',
    'send',
    'trash',
];

function getIconPath(icon: string) {
    return path.resolve(
        __dirname,
        `node_modules/@shoelace-style/shoelace/dist/assets/icons/${icon}.svg`,
    );
}

function getStaticCopyPlugin() {
    return [
        viteStaticCopy({
            targets: [
                {
                    src: icons.map(getIconPath),
                    dest: path.resolve(__dirname, 'dist/shoelace/assets/icons'),
                },
                {
                    src: path.resolve(__dirname, 'src/typings'),
                    dest: path.resolve(__dirname, 'dist/typings'),
                },
            ],
        }),
    ];
}

const customElementName = 'chat-bot';

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        build: {
            cssCodeSplit: false,
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: customElementName,
                fileName: (format) => `index.${format}.js`,
                formats: ['es', 'umd'],
            },
            rollupOptions: {
                // external: /^lit/,
                output: {
                    assetFileNames: 'index.[ext]',
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        plugins: [
            createHtmlPlugin({
                minify: true,
                /**
                 * Data that needs to be injected into the index.html ejs template
                 */
                inject: {
                    data: {
                        title: 'ChatBot',
                        openaiBaseUrl: process.env.VITE_OPENAI_BASE_URL,
                    },
                },
            }),

            // https://github.com/antfu/unocss
            // see unocss.config.ts for config
            // FIXME: unocss is not working
            // Unocss(),

            ViteInspector(),

            replace({
                preventAssignment: true,
                __DATE__: new Date().toISOString(),
            }),

            ...getStaticCopyPlugin(),
        ],
        server: {
            port: 8080,
            hmr: {
                host: 'localhost',
                port: 8080,
            },
            watch: {
                ignored: ['**/demo/**'],
            },
            proxy: {
                '/openai': {
                    // target: 'https://api.openai.com/v1/',
                    target: process.env.VITE_OPENAI_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/openai/, ''),
                },
            },
        },
    });
};
