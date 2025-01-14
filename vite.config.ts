import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// eslint-disable-next-line node/prefer-global/process
const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
    plugins: [
        tsconfigPaths({
            projects: ['tsconfig.json'],
        }),
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler'],
                    ['./src/babel.js'],
                ],
            },
        }),
    ],
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                    protocol: 'ws',
                    host,
                    port: 1421,
                }
            : undefined,
        watch: {
            ignored: ['**/src-tauri/**'],
        },
    },
}))
