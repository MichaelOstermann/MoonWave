import { computed } from '@app/utils/signals/computed'
import { $draggingPlaylistIds } from './draggingPlaylistIds'

export const $isDraggingPlaylists = computed(() => $draggingPlaylistIds().length > 0)
