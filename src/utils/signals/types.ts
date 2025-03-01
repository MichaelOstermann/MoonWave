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
