import { event } from '@monstermann/signals'

export const onDeleteTracks = event<Set<string>>()
export const onDeletePlaylists = event<Set<string>>()
