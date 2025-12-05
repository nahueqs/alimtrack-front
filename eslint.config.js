import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import {defineConfig, globalIgnores} from 'eslint/config'
import prettier from 'eslint-config-prettier' // ¡Mantenemos solo el config!

export default defineConfig([
    // 1. Ignorar el directorio de build
    globalIgnores(['dist']),

    {
        files: ['**/*.{ts,tsx}'],

        // 2. Extiende solo las configs necesarias, y usa 'prettier' SÓLO para desactivar conflictos.
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended, // Usar spread es común en flat config
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            prettier, // Desactiva las reglas de ESLint que Prettier manejará.
        ],

        // 3. Opciones de Lenguaje
        languageOptions: {
            ecmaVersion: 2021,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                sourceType: 'module',
            },
        },

        // 4. Reglas
        rules: {
            // Reglas de React
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
            // *IMPORTANTE: La regla 'prettier/prettier' ha sido eliminada.
        },

        // 5. Settings
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
])