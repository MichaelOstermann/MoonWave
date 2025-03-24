import { effect as eff } from '../effect'
import { dispose } from './dispose'

export function waitFor(fn: () => boolean): Promise<void> {
    return new Promise((resolve) => {
        eff(() => {
            if (!fn()) return
            dispose()
            resolve()
        })
    })
}
