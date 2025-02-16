/// <reference types="vite/client" />

import 'react'

declare module 'lucide-react' {
    export * from 'lucide-react/dist/lucide-react.prefixed'
}

declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined
    }
}
