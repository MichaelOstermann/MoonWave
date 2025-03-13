import { computed } from '@monstermann/signals'
import { $viewingPlaylist } from './viewingPlaylist'

export const $viewingPlaylistIcon = computed(() => {
    return $viewingPlaylist()?.icon
})
