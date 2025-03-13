import type { Track } from '@app/types'
import { effect, signal } from '@monstermann/signals'
import { $selectedTracks } from '../tracks/selectedTracks'
import { $isSavingTags } from './isSavingTags'
import { $isSidepanelVisible } from './isSidepanelVisible'

export type TrackTags = {
    title: string
    artist: string
    album: string
    year: string
    trackNr: string
    diskNr: string
}

export const $trackTags = signal<TrackTags>({
    title: '',
    artist: '',
    album: '',
    year: '',
    trackNr: '',
    diskNr: '',
})

effect(() => {
    if ($isSavingTags()) return
    if (!$isSidepanelVisible()) return

    const tracks = $selectedTracks()

    $trackTags.set({
        title: getTag('title', tracks),
        artist: getTag('artist', tracks),
        album: getTag('album', tracks),
        year: getTag('year', tracks),
        trackNr: getTag('trackNr', tracks),
        diskNr: getTag('diskNr', tracks),
    })
})

function getTag(name: keyof TrackTags, tracks: Track[]): string {
    let value: Track[keyof TrackTags]

    for (const track of tracks) {
        value ??= track[name]
        if (value !== track[name])
            return 'Various'
    }

    if (!value) return ''
    return String(value)
}
