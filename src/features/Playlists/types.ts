import type { IconName } from "#config/icons"
import type { Color } from "../Theme"

export type Playlist = {
    color?: PlaylistColor
    expanded?: true
    icon?: PlaylistIcon
    id: string
    parentId?: string
    title: string
    trackIds: string[]
}

export type PlaylistColor =
    | { type: "PRESET", value: Color }

export type PlaylistIcon =
    | { type: "LUCIDE", value: IconName }
