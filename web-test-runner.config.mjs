import { esbuildPlugin } from '@web/dev-server-esbuild';
import { globbySync } from 'globby';

export default {
    rootDir: '.',
    files: [
        '**/*.(spec|test).ts', // include `.spec.ts` and `.test.ts` files
        '!**/node_modules/**/*', // exclude any node modules
    ],
    concurrentBrowsers: 1,
    nodeResolve: {
        browser: true,
        preferBuiltins: false,
    },
    testFramework: {
        config: {
            timeout: 3000,
            retries: 1,
        },
    },
    plugins: [
        esbuildPlugin({
            ts: true,
            target: 'auto',
        }),
    ],
    // TODO: Add playwrightLauncher
    // browsers: [
    //     playwrightLauncher({ product: 'chromium' }),
    // ],
    testRunnerHtml: (testFramework) => `
        <html lang="en-US">
          <head></head>
          <body>
            <script type="module" src="dist/index.es.js"></script>
            <script type="module" src="${testFramework}"></script>
          </body>
        </html>
      `,
    // Create a named group for every test file to enable running single tests. If a test file is `split-panel.test.ts`
    // then you can run `npm run test -- --group split-panel` to run only that component's tests.
    groups: globbySync('src/**/*.test.ts').map((path) => {
        const groupName = path.match(/^.*\/(?<fileName>.*)\.test\.ts/).groups
            .fileName;
        return {
            name: groupName,
            files: path,
        };
    }),
};
