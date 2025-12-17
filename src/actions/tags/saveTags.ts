import { Library } from "#features/Library"
import { Tags } from "#features/Tags"
import { TrackList } from "#features/TrackList"
import { Tracks } from "#features/Tracks"
import { Array, Object, pipe, Promise, String } from "@monstermann/fn"
import { action, batch } from "@monstermann/signals"

export const saveTags = action(async () => {
    if (Library.$isSyncing()) return
    if (Tags.$isSaving()) return

    const currentTags = Tags.$tracks()
    const editedTags = Tags.$edited()

    const updatedTags = pipe(
        Object.entries(editedTags),
        Array.filter(([key, value]) => !Object.propIs(currentTags, key, value)),
        Array.mapEach(([key, value]) => [key, String.trim(value)] as const),
        Object.fromEntries(),
    )

    const updates = pipe(
        TrackList.$selected(),
        Array.mapEach(track => [track.path, Tags.forTrack(track)] as const),
        Array.reject(([_, tagsBefore]) => Object.matches(tagsBefore, updatedTags)),
        Array.mapEach(([path, tagsBefore]) => [path, Object.merge(tagsBefore, updatedTags)] as const),
    )

    if (updates.length === 0) return

    Tags.$isSaving(true)

    const startedAt = Date.now()
    const timer = setTimeout(() => Tags.$showSavingSpinner(true), 200)

    const metadata = await Library.saveTags(updates)
    const allTracks = Tracks.updateMetadata(Tracks.$all(), metadata)
    const finalizedTracks = await Library.reorganizeFiles(allTracks)

    clearTimeout(timer)

    if (Tags.$showSavingSpinner()) {
        const finishedAt = Date.now()
        const elapsedTime = finishedAt - startedAt
        await Promise.wait(1000 - elapsedTime)
        Tags.$showSavingSpinner(false)
    }

    batch(() => {
        Tags.$showSavingDone(true)
        Tracks.$all(finalizedTracks)
    })

    await Promise.wait(1000)

    batch(() => {
        Tags.$showSavingDone(false)
        Tags.$isSaving(false)
    })
})
