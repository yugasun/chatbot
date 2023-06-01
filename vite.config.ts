import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';
import replace from '@rollup/plugin-replace';
import { createHtmlPlugin } from 'vite-plugin-html';
import ViteInspector from 'vite-plugin-inspect';
// import Unocss from 'unocss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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

            viteStaticCopy({
                targets: [
                    {
                        src: path.resolve(
                            __dirname,
                            'node_modules/@shoelace-style/shoelace/dist/assets',
                        ),
                        dest: path.resolve(__dirname, 'dist/shoelace'),
                    },
                    {
                        src: path.resolve(__dirname, 'src/typings'),
                        dest: path.resolve(__dirname, 'dist/typings'),
                    },
                ],
            }),
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
                '/api': {
                    // target: 'https://api.openai.com/v1/',
                    target: process.env.VITE_OPENAI_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    });
};
