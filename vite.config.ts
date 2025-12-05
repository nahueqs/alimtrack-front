import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'],
    server: {
        proxy: {
            // Regla 1: Redirige /api a tu backend
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            // Regla 2 (NUEVA): Redirige /auth a tu backend
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});