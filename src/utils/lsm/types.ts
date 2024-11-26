export type LSMState<T> = {
    readonly selected: readonly string[]
    readonly selectables: readonly T[]
    readonly anchors: ReadonlySet<string>
    readonly multiselection: boolean
    readonly getKey: (selectable: T) => string
    cache: Record<symbol, unknown>
}
