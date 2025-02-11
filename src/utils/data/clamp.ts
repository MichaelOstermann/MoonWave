import { dfdl } from './dfdl'

export const clamp: {
    (min: number, max: number): (value: number) => number
    (value: number, min: number, max: number): number
} = dfdl((value, min, max) => {
    return Math.min(Math.max(value, min), max)
}, 3)
