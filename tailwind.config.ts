import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/index.html',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontSize: {
                xxs: ['0.625rem', '0.875rem'],
            },
        },
    },
    plugins: [],
} satisfies Config
