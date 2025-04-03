import type { Playlist } from '@app/types'
import { $playlistTree } from '@app/state/playlists/playlistTree'

export function getPlaylistChildren(id: string): Playlist[] {
    return $playlistTree().nodes.get(id)?.children.map(node => node.playlist) ?? []
}
