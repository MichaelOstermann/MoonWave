import { indexed } from "@monstermann/signals"
import { Playlists } from "."

export const $byId = indexed(Playlists.$all, p => [p.id, p])
