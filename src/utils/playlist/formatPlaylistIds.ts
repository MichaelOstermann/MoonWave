import { $playlistsById } from '@app/state/state'

export function formatPlaylistIds(playlistIds: string[], opts: {
    one: (title: string) => string
    many: (count: number) => string
}): string {
    const playlists = playlistIds
        .map(pid => $playlistsById(pid).value)
        .filter(t => !!t)

    if (playlists.length > 1) return opts.many(playlists.length)
    if (playlists.length === 1) return opts.one(playlists[0]!.title)

    return ''
}
