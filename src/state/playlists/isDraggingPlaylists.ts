import { computed } from '@monstermann/signals'
import { $draggingPlaylistIds } from './draggingPlaylistIds'

export const $isDraggingPlaylists = computed(() => $draggingPlaylistIds().length > 0)
