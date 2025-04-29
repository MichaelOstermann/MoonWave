import type { EditableTags } from "."
import { effect, signal } from "@monstermann/signals"
import { Tags } from "."

export const $edited = signal<EditableTags>(Tags.empty)

// TODO this should probably be explicitly reset

effect(() => {
    $edited(Tags.$tracks())
})
