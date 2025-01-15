import { pipeInto } from 'ts-functional-pipe'

const defaultWidth = 280
const minWidth = 200
const maxWidth = 400

export function getSidebarWidth(width: number | undefined): number {
    return pipeInto(
        width ?? defaultWidth,
        w => Math.min(w, maxWidth),
        w => Math.max(w, minWidth),
        w => Math.round(w),
    )
}
