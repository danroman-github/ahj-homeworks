import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import jest from 'eslint-plugin-jest';

export default defineConfig([
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } }
    },
    {
        // files: ['src/**/*.js],  
        rules: {
            indent: ['error', 4], // отступы, авто
            semi: ['error', 'always'], // точка с запятой, авто
            'no-unused-vars': 'error', // не используемые переменные
            'no-console': 'off', // console.log
            'no-var': 'error',
            quotes: ['error', 'single'], // кавычки одинарные или double
        },
    },
    {
        ignores: ['dist/', 'coverage/', '*.json'], // отключение проверок для папок
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended']
    },
    {
        files: ['**/*.test.js'],
        ...jest.configs['flat/recommended'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            'jest/prefer-expect-assertions': 'off',
            'jest/expect-expect': 'error',
        },
    },
]);
