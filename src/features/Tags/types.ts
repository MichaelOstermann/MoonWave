export type Tags = {
    album: string
    artist: string
    diskNr: number | null
    title: string
    trackNr: number | null
    year: number | null
}

export type EditableTags = {
    [K in keyof Tags]-?: string
}
