export const SIGNAL = Symbol('signal')
export const EFFECT = Symbol('effect')
export const EVENT = Symbol('event')

export interface Meta {
    name: string
    path: string
    line: number
}

export type InternalMeta = {
    name?: string
    path?: string
    line?: number
    dispose?: Set<() => void>
}
