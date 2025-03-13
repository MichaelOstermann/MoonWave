import type { AudioMetadata, Track } from '@app/types'
import { $tracks } from '@app/state/tracks/tracks'
import { invoke } from '@tauri-apps/api/core'
import { nanoid } from 'nanoid'
import { indexBy } from './data/indexBy'
import { merge } from './data/merge'

export async function parseAudioFiles(paths: string[], opts: {
    onProgress?: (count: number) => void
    onTrack: (track: Track) => void
}): Promise<void> {
    const date = Date.now()
    const tracksIdx = indexBy($tracks(), t => t.filehash)
    const copy = [...paths]

    while (copy.length) {
        const next = copy.splice(0, 20)
        const files = await invoke<AudioMetadata[]>('parse_audio_metadata', { filePaths: next }).catch(() => [])
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
            ? merge(existing, { path: data.path })
            : { ...data, id: nanoid(10), addedAt: date }
    })
}
