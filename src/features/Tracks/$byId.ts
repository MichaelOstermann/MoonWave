import { indexed } from "@monstermann/signals"
import { Tracks } from "."

export const $byId = indexed(Tracks.$all, t => [t.id, t])
