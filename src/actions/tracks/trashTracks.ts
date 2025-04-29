import { Fs } from "#features/Fs"
import { Tracks } from "#features/Tracks"
import { Array } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const trashTracks = action(async (trackIds: string[]) => {
    const paths = trackIds
        .map(tid => Tracks.$byId.get(tid))
        .filter(t => !!t)
        .map(t => t.path)

    if (!paths.length) return

    if (import.meta.env.PROD) {
        const ok = await Fs.trashFiles(paths)
        if (!ok) return
    }

    Tracks.$all(Array.reject(t => trackIds.includes(t.id)))
})
