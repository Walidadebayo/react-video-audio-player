import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from "globals";

const config = [{
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            },
            ecmaVersion: 2020,
            sourceType: 'module',
            project: './tsconfig.json',
        },
        globals: Object.fromEntries(
            Object.entries({
                ...globals.browser,
                ...globals.node,
                NodeJS: 'readonly',
            }).map(([key, value]) => [key.trim(), value])
        ),
    },
    plugins: {
        '@typescript-eslint': tsPlugin,
        'react': reactPlugin,
        'react-hooks': reactHooksPlugin,
        'react-refresh': reactRefreshPlugin
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        ...js.configs.recommended.rules,
        ...tsPlugin.configs.recommended.rules,
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true }
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
}];

export default config;