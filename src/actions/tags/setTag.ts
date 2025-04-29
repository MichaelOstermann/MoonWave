import type { EditableTags } from "#features/Tags"
import { Tags } from "#features/Tags"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const setTag = action(({ name, value }: { name: keyof EditableTags, value: string }) => {
    Tags.$edited(Object.merge({
        [name]: value,
    }))
})
