import type { TrackTags } from '@app/state/sidepanel/trackTags'
import type { AudioMetadata, Track } from '@app/types'
import { $isSyncing } from '@app/state/app/isSyncing'
import { $editedTags } from '@app/state/sidepanel/editedTags'
import { $isSavingTags } from '@app/state/sidepanel/isSavingTags'
import { $showSavingTagsDone } from '@app/state/sidepanel/showSavingTagsDone'
import { $showSavingTagsSpinner } from '@app/state/sidepanel/showSavingTagsSpinner'
import { $trackTags } from '@app/state/sidepanel/trackTags'
import { $selectedTracks } from '@app/state/tracks/selectedTracks'
import { $tracks } from '@app/state/tracks/tracks'
import { indexBy } from '@app/utils/data/indexBy'
import { map } from '@app/utils/data/map'
import { merge } from '@app/utils/data/merge'
import { pick } from '@app/utils/data/pick'
import { sleep } from '@app/utils/data/sleep'
import { toU32 } from '@app/utils/toU32'
import { action, batch } from '@monstermann/signals'
import { invoke } from '@tauri-apps/api/core'

export const saveTags = action(async () => {
    if ($isSyncing()) return
    if ($isSavingTags()) return

    const currentTags = $trackTags()
    const editedTags = $editedTags()
    const tagKeys = Object.keys(currentTags) as (keyof TrackTags)[]

    const updatedTags: Partial<Pick<Track, keyof TrackTags>> = {}

    for (const key in editedTags) {
        const k = key as keyof TrackTags
        if (editedTags[k] === currentTags[k]) continue
        if (k === 'year') updatedTags[k] = toU32(editedTags[k])
        else if (k === 'trackNr') updatedTags[k] = toU32(editedTags[k])
        else if (k === 'diskNr') updatedTags[k] = toU32(editedTags[k])
        else updatedTags[k] = editedTags[k]
    }

    const changes = $selectedTracks().flatMap((trackBefore) => {
        const trackAfter = merge(trackBefore, updatedTags)
        if (trackBefore === trackAfter) return []
        return [{
            path: trackAfter.path,
            tags: pick(trackAfter, tagKeys),
        }]
    })

    if (changes.length === 0) return

    $isSavingTags.set(true)

    const startedAt = Date.now()
    const timer = setTimeout(() => $showSavingTagsSpinner.set(true), 200)
    const updates: AudioMetadata[] = []

    for (const { path, tags } of changes) {
        const track = await invoke<AudioMetadata>('save_tags', { path, tags }).catch(() => {})
        if (track) updates.push(track)
    }

    clearTimeout(timer)

    if ($showSavingTagsSpinner()) {
        const finishedAt = Date.now()
        const elapsedTime = finishedAt - startedAt
        await sleep(1000 - elapsedTime)
        $showSavingTagsSpinner.set(false)
    }

    batch(() => {
        $showSavingTagsDone.set(true)
        $tracks.map((tracks) => {
            const idx = indexBy(updates, t => t.path)
            return map(tracks, (oldTrack) => {
                const newTrack = idx[oldTrack.path]
                return newTrack
                    ? merge(oldTrack, newTrack)
                    : oldTrack
            })
        })
    })

    await sleep(1000)

    batch(() => {
        $showSavingTagsDone.set(false)
        $isSavingTags.set(false)
    })
})
