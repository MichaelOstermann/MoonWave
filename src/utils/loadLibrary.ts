import type { Config, Playlist, PlaylistToTrack, Track } from '@app/types'
import { $config, $playlists, $playlistsToTracks, $tracks } from '@app/state/state'
import { batch } from '@preact/signals-react'
import { app } from '@tauri-apps/api'
import { LazyStore } from '@tauri-apps/plugin-store'
import { changeEffect } from './signals/changeEffect'

const store = new LazyStore('library.json', {
    autoSave: 5_000,
})

export async function loadLibrary(): Promise<void> {
    const [
        currentVersion,
        libraryVersion,
        config,
        tracks,
        playlists,
        playlistsToTracks,
    ] = await Promise.all([
        app.getVersion(),
        store.get<string>('version'),
        store.get<Config>('config'),
        store.get<Track[]>('tracks'),
        store.get<Playlist[]>('playlists'),
        store.get<PlaylistToTrack[]>('playlistsToTracks'),
    ])

    if (currentVersion !== libraryVersion)
        store.set('version', currentVersion)

    batch(() => {
        $config.set(config ?? {})
        $tracks.set(tracks ?? [])
        $playlists.set(playlists ?? [])
        $playlistsToTracks.set(playlistsToTracks ?? [])
    })

    changeEffect(() => $config.value, config => store.set('config', config))
    changeEffect(() => $tracks.value, tracks => store.set('tracks', tracks))
    changeEffect(() => $playlists.value, playlists => store.set('playlists', playlists))
    changeEffect(() => $playlistsToTracks.value, playlistsToTracks => store.set('playlistsToTracks', playlistsToTracks))
}
