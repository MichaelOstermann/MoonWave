import type { EditableTags } from "#features/Tags"
import { Tags } from "#features/Tags"
import { Object } from "@monstermann/fn"
import { action } from "@monstermann/signals"

export const resetTag = action(({ name }: { name: keyof EditableTags }) => {
    Tags.$edited(Object.merge({
        [name]: Tags.$tracks()[name],
    }))
})
