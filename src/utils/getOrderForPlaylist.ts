import type { Order } from '@app/types'
import { defaultPlaylistOrder } from '@app/config/config'
import { $playlistsById } from '@app/state/state'

export function getOrderForPlaylist(playlistId: string): Order[] {
    return $playlistsById(playlistId).value?.order ?? defaultPlaylistOrder
}
