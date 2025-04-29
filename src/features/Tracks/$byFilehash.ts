import { indexed } from "@monstermann/signals"
import { Tracks } from "."

export const $byFilehash = indexed(Tracks.$all, t => [t.filehash, t])
