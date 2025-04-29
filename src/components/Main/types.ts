export type Column =
    | "position"
    | "title"
    | "artist"
    | "album"
    | "duration"

export type Row = {
    album: string
    artist: string
    duration: string
    id: string
    position: string
    title: string
}
