import { $playlistTree } from '@app/state/playlists/playlistTree'

export function getPlaylistDepth(id: string): number {
    return $playlistTree().nodes.get(id)?.depth ?? 0
}
