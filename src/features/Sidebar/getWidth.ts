import { Number, pipe } from "@monstermann/fn"

export function getWidth(width: number | undefined): number {
    return pipe(
        width,
        Number.or(290),
        Number.clamp(200, 400),
    )
}
