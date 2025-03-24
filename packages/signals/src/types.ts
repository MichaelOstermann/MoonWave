export const SIGNAL = Symbol('SIGNAL')
export const EFFECT = Symbol('EFFECT')
export const EVENT = Symbol('EVENT')
export const ACTION = Symbol('ACTION')

export interface Meta {
    name: string
    path: string
    line: number
    internal: boolean
}

export interface WritableSignal<T> {
    (): T
    meta: Meta
    kind: typeof SIGNAL
    peek: () => T
    set: (value: T) => void
    map: (transform: (value: T) => T) => void
}

export interface ReadonlySignal<T> {
    (): T
    meta: Meta
    kind: typeof SIGNAL
    peek: () => T
}

export type Signal<T> = WritableSignal<T> | ReadonlySignal<T>

export interface Event<T = void> {
    (value: T): void
    meta: Meta
    kind: typeof EVENT
    hasListeners: () => boolean
    subscribe: (callback: EventCallback<T>) => void
    unsubscribe: (callback: EventCallback<T>) => void
}

export interface OnEvent {
    (): void
    meta: Meta
}

export interface EventCallback<T = void> {
    (value: T): void
}

export interface Action<T = never, U = void> {
    (...args: ([T] extends [never] ? [] : [payload: T])): U
    meta: Meta
    kind: typeof ACTION
}

export interface Effect {
    (): void
    meta: Meta
    kind: typeof EFFECT
}
