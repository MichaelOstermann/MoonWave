import { clamp } from './data/clamp'

const max = 2 ** 32 - 1

export function toU32(value: string): number | undefined {
    const int = Number.parseInt(value)
    if (Number.isNaN(int)) return undefined
    return clamp(int, 0, max)
}
