import type { AudioMetadata, Track } from "#features/Tracks"
import { Tracks } from "#features/Tracks"
import { Array, Object } from "@monstermann/fn"
import { invoke } from "@tauri-apps/api/core"
import { nanoid } from "nanoid"

export async function fetchFiles(paths: string[], opts: {
    onProgress?: (count: number) => void
    onTrack: (track: Track) => void
}): Promise<void> {
    const date = Date.now()
    const tracksIdx = Array.indexBy(Tracks.$all(), t => t.filehash)
    const copy = [...paths]

    while (copy.length) {
        const next = copy.splice(0, 20)
        const files = await invoke<AudioMetadata[]>("parse_audio_metadata", { paths: next })
            .catch(() => [])
        const tracks = processAudioFiles(files, { date, tracksIdx })
        opts.onProgress?.(next.length)
        tracks.forEach(track => opts.onTrack(track))
    }
}

function processAudioFiles(data: AudioMetadata[], { date, tracksIdx }: {
    date: number
    tracksIdx: Record<string, Track>
}): Track[] {
    return data.map((data) => {
        const existing = tracksIdx[data.filehash]
        return existing
            ? Object.merge(existing, data)
            : Object.assign(data, { addedAt: date, id: nanoid(10) })
    })
}
