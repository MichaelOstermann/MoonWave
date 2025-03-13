import { effect, signal } from '@monstermann/signals'
import { $trackTags, type TrackTags } from './trackTags'

export const $editedTags = signal<TrackTags>({
    title: '',
    artist: '',
    album: '',
    year: '',
    trackNr: '',
    diskNr: '',
})

effect(() => {
    $editedTags.set($trackTags())
})
