import type { Order } from '@app/types'

export const defaultLibraryOrder: Order[] = [
    ['ARTIST', 'ASC'],
    ['DATE', 'ASC'],
    ['ALBUM', 'ASC'],
    ['DISK_NR', 'ASC'],
    ['TRACK_NR', 'ASC'],
    ['TITLE', 'ASC'],
]

export const recentlyAddedOrder: Order[] = [
    ['ADDED_AT', 'DESC'],
]

export const defaultUnsortedOrder = defaultLibraryOrder

export const defaultPlaylistOrder: Order[] = [
    ['DATE', 'ASC'],
    ['ALBUM', 'ASC'],
    ['DISK_NR', 'ASC'],
    ['TRACK_NR', 'ASC'],
    ['ADDED_AT', 'ASC'],
    ['TITLE', 'ASC'],
]
