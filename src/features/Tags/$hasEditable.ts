import { Sidepanel } from "#features/Sidepanel"
import { TrackList } from "#features/TrackList"
import { Array } from "@monstermann/fn"
import { effect, signal } from "@monstermann/signals"
import { Tags } from "."

export const $hasEditable = signal(false)

effect(() => {
    if (Tags.$isSaving()) return
    if (!Sidepanel.$isVisible()) return
    $hasEditable(!Array.isEmpty(TrackList.$selected()))
})
