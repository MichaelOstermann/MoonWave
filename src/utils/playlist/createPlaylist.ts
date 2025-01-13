import type { Playlist } from '@app/types'
import { nanoid } from 'nanoid'

export function createPlaylist(): Playlist {
    return {
        id: nanoid(10),
        title: '',
        trackIds: [],
    }
}
