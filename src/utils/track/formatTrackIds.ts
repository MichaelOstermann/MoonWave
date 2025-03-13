import { $tracksById } from '@app/state/tracks/tracksById'

export function formatTrackIds(trackIds: string[], opts: {
    one: (title: string) => string
    many: (count: number) => string
}): string {
    const tracks = trackIds
        .map(tid => $tracksById(tid)())
        .filter(t => !!t)

    if (tracks.length > 1) return opts.many(tracks.length)
    if (tracks.length === 1) return opts.one(tracks[0]!.title)

    return ''
}
