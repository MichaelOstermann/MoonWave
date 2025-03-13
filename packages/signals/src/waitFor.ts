import { dispose } from './dispose'
import { effect } from './effect'

export function waitFor(fn: () => boolean): Promise<void> {
    return new Promise((resolve) => {
        effect(() => {
            if (!fn()) return
            dispose()
            resolve()
        })
    })
}
