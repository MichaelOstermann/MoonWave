import { createPlaylistTree } from '@app/utils/playlist/createPlaylistTree'
import { computed } from '@monstermann/signals'

export const $playlistTree = computed(createPlaylistTree)
