import { Array, Number, pipe, String, when } from "@monstermann/fn"

export function formatDuration(seconds: number): string {
    return pipe(
        seconds,
        Number.or(0),
        Number.max(0),
        v => [Number.floor(v / 3600), Number.floor((v % 3600) / 60), Number.floor(v % 60)],
        Array.mapEach(Number.toString()),
        Array.mapEach(String.padStart(2, "0")),
        Array.join(":"),
        when(String.startsWith("00:"), String.drop(3)),
        when(String.startsWith("0"), String.drop(1)),
    )
}
