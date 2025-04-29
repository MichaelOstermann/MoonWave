import { Object } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { Tags } from "."

export const $hasEdited = memo(() => {
    const current = Tags.$tracks()
    const edited = Tags.$edited()
    return !Object.isShallowEqual(current, edited)
})
