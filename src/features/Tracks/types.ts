import type { Tags } from "../Tags"

export type Track = AudioMetadata & {
    addedAt: number
    id: string
}

export type AudioMetadata = Tags & {
    bitrate: number | null
    duration: number
    filehash: string
    mimetype: string
    path: string
    sampleRate: number | null
    size: number
}
