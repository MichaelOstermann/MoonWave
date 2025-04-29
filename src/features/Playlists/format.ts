import { Array, match } from "@monstermann/fn"
import { Playlists } from "."

export function format(playlistIds: string[], opts: {
    many: (count: number) => string
    one: (title: string) => string
}): string {
    const playlists = playlistIds
        .map(pid => Playlists.$byId.get(pid))
        .filter(t => !!t)

    return match(playlists.length)
        .case(0, "")
        .onCase(1, () => opts.one(Array.firstOrThrow(playlists).title))
        .orElse(opts.many)
}
