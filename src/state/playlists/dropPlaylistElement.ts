import { effect, signal } from '@monstermann/signals'
import { $dropPlaylistId } from './dropPlaylistId'

export const $dropPlaylistElement = signal<HTMLElement>(null)

effect(() => {
    if ($dropPlaylistId()) return
    $dropPlaylistElement.set(null)
})
