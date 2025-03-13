import { computed } from '@monstermann/signals'
import { $viewingPlaylist } from './viewingPlaylist'

export const $viewingPlaylistColor = computed(() => {
    return $viewingPlaylist()?.color
})
