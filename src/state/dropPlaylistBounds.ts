import { computed } from '@app/utils/signals/computed'
import { $dropPlaylistElement } from './dropPlaylistElement'

export const $dropPlaylistBounds = computed(() => $dropPlaylistElement()?.getBoundingClientRect())
