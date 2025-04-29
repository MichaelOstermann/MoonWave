import type { EditableTags } from "."
import { Sidepanel } from "#features/Sidepanel"
import { TrackList } from "#features/TrackList"
import { effect, signal } from "@monstermann/signals"
import { Tags } from "."

export const $tracks = signal<EditableTags>(Tags.empty)

effect(() => {
    if (Tags.$isSaving()) return
    if (!Sidepanel.$isVisible()) return

    const tracks = TrackList.$selected()
    $tracks(Tags.forTracks(tracks))
})
