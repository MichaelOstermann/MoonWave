export type LSM<T> = {
    readonly anchors: ReadonlySet<string>
    cache: Record<symbol, unknown>
    readonly multiselection: boolean
    readonly selectables: readonly T[]
    readonly selected: readonly string[]
    readonly getKey: (selectable: T) => string
}
