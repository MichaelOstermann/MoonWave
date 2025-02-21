import { pipe } from '../data/pipe'

const defaultWidth = 290
const minWidth = 200
const maxWidth = 400

export function getSidebarWidth(width: number | undefined): number {
    return pipe(
        width ?? defaultWidth,
        w => Math.min(w, maxWidth),
        w => Math.max(w, minWidth),
        w => Math.round(w),
    )
}
