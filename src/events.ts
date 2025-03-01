import { event } from './utils/signals/event'

export const onDeleteTracks = event<Set<string>>()
export const onDeletePlaylists = event<Set<string>>()
