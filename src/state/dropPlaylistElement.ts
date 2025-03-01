import { signal } from '@app/utils/signals/signal'
import { effect } from '@preact/signals-core'
import { $dropPlaylistId } from './dropPlaylistId'

export const $dropPlaylistElement = signal<HTMLElement>(null)

effect(() => {
    if ($dropPlaylistId()) return
    $dropPlaylistElement.set(null)
})
