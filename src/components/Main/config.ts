import type { Column } from "./types"
import { LucideClock3 } from "lucide-react"
import { createElement } from "react"

export const iconSize = 14

export const header = {
    album: "Album",
    artist: "Artist",
    position: "#",
    title: "Title",
    duration: createElement(LucideClock3, {
        style: {
            height: iconSize,
            width: iconSize,
        },
    }),
}

export const columns: Column[] = ["position", "title", "artist", "album", "duration"]
export const reservedColumns = { duration: true, position: true }
export const minWidths = { duration: iconSize, position: iconSize }
