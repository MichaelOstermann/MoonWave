import type { Track } from '@app/types'
import { extensions } from '@app/config/extensions'
import { $tracks } from '@app/state/state'
import { invoke } from '@tauri-apps/api/core'
import { Command } from '@tauri-apps/plugin-shell'
import { nanoid } from 'nanoid'
import { indexBy } from './data/indexBy'
import { merge } from './data/merge'
import { replace } from './data/replace'

export async function parseAudioFile(opts: {
    date: string
    relPath: string
    absPath: string
    tracksByFilehash: Record<string, Track>
    tracksByAudiohash: Record<string, Track>
}): Promise<Track | null> {
    const filehash = await getFilehash(opts.absPath)

    const trackByFilehash = opts.tracksByFilehash[filehash]
    if (trackByFilehash) {
        const track = merge(trackByFilehash, { path: opts.relPath })
        $tracks.map(replace(trackByFilehash, track))
        return track
    }

    const [audiohash, metadata] = await Promise.all([
        getAudiohash(opts.absPath),
        getMetadata(opts.absPath),
    ])

    const trackByAudioHash = opts.tracksByAudiohash[audiohash]
    if (trackByAudioHash) {
        const track = merge(trackByAudioHash, { ...metadata, filehash, path: opts.relPath })
        $tracks.map(replace(trackByAudioHash, track))
        return track
    }

    const mimetype = await getMimeType(opts.absPath)
    if (!mimetype.startsWith('audio/')) return null

    const track = {
        path: opts.relPath,
        id: nanoid(10),
        mimetype,
        filehash,
        audiohash,
        addedAt: opts.date,
        ...metadata,
    }

    $tracks.map(t => [...t, track])
    return track
}

export async function parseAudioFiles(opts: {
    libraryPath: string
    relPaths: string[]
    onProgress: () => void
}): Promise<Set<string>> {
    const date = new Date().toISOString()
    const tracksByFilehash = indexBy($tracks.value, t => t.filehash)
    const tracksByAudiohash = indexBy($tracks.value, t => t.audiohash)
    const trackIds = new Set<string>()

    for (const relPath of opts.relPaths) {
        const track = await parseAudioFile({
            date,
            absPath: `${opts.libraryPath}/${relPath}`,
            relPath,
            tracksByFilehash,
            tracksByAudiohash,
        }).catch(() => null)
        if (track) trackIds.add(track.id)
        opts.onProgress()
    }

    return trackIds
}

export async function getMimeType(absPath: string): Promise<string> {
    const mimetype = await invoke<string>('get_file_mimetype', { filePath: absPath })
    if (!mimetype) throw new Error('Invalid mimetype')
    return mimetype
}

export async function getFilehash(absPath: string): Promise<string> {
    const { stdout } = await Command.create('openssl', ['sha256', absPath]).execute()
    const filehash = stdout.trim().split('= ').at(1)
    if (!filehash) throw new Error('Invalid filehash')
    return filehash
}

async function getAudiohash(absPath: string): Promise<string> {
    const { stdout } = await Command.sidecar('bin/ffmpeg', ['-i', absPath, '-map', '0:a', '-c', 'copy', '-f', 'md5', '-']).execute()
    const audiohash = stdout.trim().replace('MD5=', '')
    if (!audiohash) throw new Error('Invalid audiohash')
    return audiohash
}

async function getMetadata(absPath: string): Promise<Omit<Track, 'id' | 'addedAt' | 'path' | 'mimetype' | 'filehash' | 'audiohash'>> {
    const data = await invoke<{
        title: string | null
        artist: string | null
        album: string | null
        duration: number
        year: number | null
        track_number: number | null
        disk_number: number | null
    }>('parse_audio_metadata', { filePath: absPath })

    return {
        title: data.title?.trim() || absPath.split('/').at(-1)!.replace(extensions, '').trim(),
        artist: data.artist?.trim() || '',
        album: data.album?.trim() || '',
        duration: data.duration,
        date: data.year == null ? undefined : String(data.year),
        trackNr: data.track_number == null ? undefined : data.track_number,
        diskNr: data.disk_number == null ? undefined : data.disk_number,
    }
}
