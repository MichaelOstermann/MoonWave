export type InternalMeta = {
    name?: string
    path?: string
    line?: number
    dispose?: Set<() => void>
}
