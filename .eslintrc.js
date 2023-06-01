module.exports = {
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],

    plugins: ['@typescript-eslint'],
    rules: {
        // override/add rules settings here, such as:
    },
};
