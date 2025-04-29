import { emitter } from "@monstermann/signals"

export const onDeleteTracks = emitter<Set<string>>()
export const onDeletePlaylists = emitter<Set<string>>()
