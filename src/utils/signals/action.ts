import { batch, untracked } from '@preact/signals-react'

export interface Action<T = never, U = void> {
    (...args: ([T] extends [never] ? [] : [payload: T])): U
    id: string
    path: string
}

type ActionOptions = {
    id?: string
    path?: string
}

export function action<T = never, U = void>(fn: (payload: T) => U, options?: ActionOptions): Action<T, U> {
    const action: any = function (payload: any) {
        return untracked(() => batch(() => fn(payload)))
    }

    action.id = options?.id || 'Anonymous'
    action.path = options?.path || ''

    return action
}
