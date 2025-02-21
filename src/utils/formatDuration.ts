import { pipe } from './data/pipe'

export function formatDuration(seconds: number): string {
    return pipe(
        seconds,
        v => Math.max(v, 0),
        v => Number.isFinite(v) ? v : 0,
        v => [Math.floor(v / 3600), Math.floor((v % 3600) / 60), Math.floor(v % 60)],
        v => v.map(v => String(v).padStart(2, '0')).join(':'),
        v => v.startsWith('00:') ? v.slice(3) : v,
        v => v.startsWith('0') ? v.slice(1) : v,
    )
}
