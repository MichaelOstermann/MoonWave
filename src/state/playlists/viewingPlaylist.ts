import { computed } from '@monstermann/signals'
import { $playlistsById } from './playlistsById'
import { $viewingPlaylistId } from './viewingPlaylistId'

export const $viewingPlaylist = computed(() => {
    const id = $viewingPlaylistId()
    return $playlistsById(id)()
})
