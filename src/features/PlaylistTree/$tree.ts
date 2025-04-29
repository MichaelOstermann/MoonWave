import { Playlists } from "#features/Playlists"
import { memo } from "@monstermann/signals"
import { PlaylistTree } from "."

export const $tree = memo(() => PlaylistTree.create(Playlists.$all()))
