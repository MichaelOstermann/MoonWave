import type { Track } from '@app/types'
import { extensions } from '@app/config/extensions'
import { $tracks } from '@app/state/state'
import { invoke } from '@tauri-apps/api/core'
import { Command } from '@tauri-apps/plugin-shell'
import { nanoid } from 'nanoid'
import { indexBy } from './data/indexBy'
import { merge } from './data/merge'

export async function parseAudioFile(opts: {
    date: number
    path: string
    tracksByFilehash: Record<string, Track>
    tracksByAudiohash: Record<string, Track>
}): Promise<Track | null> {
    const filehash = await getFilehash(opts.path)

    const trackByFilehash = opts.tracksByFilehash[filehash]
    if (trackByFilehash) return merge(trackByFilehash, { path: opts.path })

    const [audiohash, metadata] = await Promise.all([
        getAudiohash(opts.path),
        getMetadata(opts.path),
    ])

    const trackByAudioHash = opts.tracksByAudiohash[audiohash]
    if (trackByAudioHash) return merge(trackByAudioHash, { ...metadata, filehash, path: opts.path })

    const mimetype = await getMimeType(opts.path)
    if (!mimetype.startsWith('audio/')) return null

    return {
        path: opts.path,
        id: nanoid(10),
        mimetype,
        filehash,
        audiohash,
        addedAt: opts.date,
        ...metadata,
    }
}

export async function parseAudioFiles(paths: string[], opts: {
    onProgress: () => void
    onTrack: (track: Track) => void
}): Promise<void> {
    const date = Date.now()
    const tracksByFilehash = indexBy($tracks(), t => t.filehash)
    const tracksByAudiohash = indexBy($tracks(), t => t.audiohash)

    for (const path of paths) {
        const track = await parseAudioFile({
            date,
            path,
            tracksByFilehash,
            tracksByAudiohash,
        }).catch(() => null)

        opts.onProgress()
        if (!track) continue
        opts.onTrack(track)
    }
}

export async function getMimeType(filePath: string): Promise<string> {
    const mimetype = await invoke<string>('get_file_mimetype', { filePath })
    if (!mimetype) throw new Error('Invalid mimetype')
    return mimetype
}

export async function getFilehash(filePath: string): Promise<string> {
    const { stdout } = await Command.create('openssl', ['sha256', filePath]).execute()
    const filehash = stdout.trim().split('= ').at(1)
    if (!filehash) throw new Error('Invalid filehash')
    return filehash
}

async function getAudiohash(filePath: string): Promise<string> {
    const { stdout } = await Command.sidecar('bin/ffmpeg', ['-i', filePath, '-map', '0:a', '-c', 'copy', '-f', 'md5', '-']).execute()
    const audiohash = stdout.trim().replace('MD5=', '')
    if (!audiohash) throw new Error('Invalid audiohash')
    return audiohash
}

async function getMetadata(filePath: string): Promise<Omit<Track, 'id' | 'addedAt' | 'path' | 'mimetype' | 'filehash' | 'audiohash'>> {
    const data = await invoke<{
        title: string | null
        artist: string | null
        album: string | null
        duration: number
        year: number | null
        track_number: number | null
        disk_number: number | null
    }>('parse_audio_metadata', { filePath })

    return {
        title: data.title?.trim() || filePath.split('/').at(-1)!.replace(extensions, '').trim(),
        artist: data.artist?.trim() || '',
        album: data.album?.trim() || '',
        duration: data.duration,
        year: data.year == null ? undefined : data.year,
        trackNr: data.track_number == null ? undefined : data.track_number,
        diskNr: data.disk_number == null ? undefined : data.disk_number,
    }
}
