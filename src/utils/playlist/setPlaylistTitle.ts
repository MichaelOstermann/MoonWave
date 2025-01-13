import type { Playlist } from '@app/types'
import { merge } from '../data/merge'

export function setPlaylistTitle(playlist: Playlist, title: string): Playlist {
    return merge(playlist, { title })
}
