import type { Column } from './types'
import { LucideClock3 } from 'lucide-react'
import { createElement } from 'react'

export const iconSize = 14

export const header = {
    position: '#',
    title: 'Title',
    artist: 'Artist',
    album: 'Album',
    duration: createElement(LucideClock3, {
        style: {
            width: iconSize,
            height: iconSize,
        },
    }),
}

export const columns: Column[] = ['position', 'title', 'artist', 'album', 'duration']
export const reservedColumns = { position: true, duration: true }
export const minWidths = { position: iconSize, duration: iconSize }
