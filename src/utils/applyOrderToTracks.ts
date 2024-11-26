import type { Order, Track } from '@app/types'

export function applyOrderToTracks(tracks: Track[], orders: Order[]): Track[] {
    if (orders.length === 0) return tracks
    return tracks.toSorted((a, b) => {
        for (const order of orders) {
            const result = comparator(order, a, b)
            if (result === 0) continue
            return result
        }
        return 0
    })
}

function comparator([field, dir]: Order, a: Track, b: Track): number {
    switch (field) {
        case 'DATE': return compareDates(a.date ?? '', b.date ?? '', dir)
        case 'TITLE': return compareStrings(a.title, b.title, dir)
        case 'ALBUM': return compareStrings(a.album, b.album, dir)
        case 'ARTIST': return compareStrings(a.artist, b.artist, dir)
        case 'ADDED_AT': return compareDates(a.addedAt, b.addedAt, dir)
        case 'DISK_NR': return compareNumbers(a.diskNr ?? 0, b.diskNr ?? 0, dir)
        case 'TRACK_NR': return compareNumbers(a.trackNr ?? 0, b.trackNr ?? 0, dir)
        case 'DURATION': return compareNumbers(a.duration, b.duration, dir)
    }
}

function compareStrings(a: string, b: string, dir: 'ASC' | 'DESC'): number {
    if (a === b) return 0
    switch (dir) {
        case 'ASC': return a.localeCompare(b)
        case 'DESC': return b.localeCompare(a)
    }
}

function compareDates(a: string, b: string, dir: 'ASC' | 'DESC'): number {
    if (a === b) return 0
    switch (dir) {
        case 'ASC': return a < b ? -1 : 1
        case 'DESC': return a > b ? -1 : 1
    }
}

function compareNumbers(a: number, b: number, dir: 'ASC' | 'DESC'): number {
    if (a === b) return 0
    switch (dir) {
        case 'ASC': return a < b ? -1 : 1
        case 'DESC': return a > b ? -1 : 1
    }
}
