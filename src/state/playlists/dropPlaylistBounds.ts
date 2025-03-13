import { computed } from '@monstermann/signals'
import { $dropPlaylistElement } from './dropPlaylistElement'

export const $dropPlaylistBounds = computed(() => $dropPlaylistElement()?.getBoundingClientRect())
