import type { Mode, Playlist } from '@app/types'
import { merge } from '../data/merge'

export function setPlaylistMode(playlist: Playlist, mode: Mode): Playlist {
    return merge(playlist, { mode })
}
