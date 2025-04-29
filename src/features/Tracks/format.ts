import { Array, match } from "@monstermann/fn"
import { Tracks } from "."

export function format(trackIds: string[], opts: {
    many: (count: number) => string
    one: (title: string) => string
}): string {
    const tracks = trackIds
        .map(tid => Tracks.$byId.get(tid))
        .filter(t => !!t)

    return match(tracks.length)
        .case(0, "")
        .onCase(1, () => opts.one(Array.firstOrThrow(tracks).title))
        .orElse(opts.many)
}
