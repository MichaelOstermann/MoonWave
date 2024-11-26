import { $showCommandMenu, $syncGoal, $syncing, $syncProgress, $tracks } from '@app/state/state'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { getAudioFilePaths } from '@app/utils/getAudioFilePaths'
import { parseAudioFiles } from '@app/utils/parseAudioFile'
import { action } from '@app/utils/signals/action'
import { batch } from '@preact/signals-react'

export const syncLibrary = action(async () => {
    $showCommandMenu.set(false)

    if ($syncing.value) return

    $syncing.set(true)
    $syncProgress.set(0)
    $syncGoal.set(0)

    const paths = await getAudioFilePaths()

    $syncGoal.set(paths.length)

    const trackIdsBefore = new Set($tracks.value.map(t => t.id))
    const trackIdsAfter = await parseAudioFiles(paths, () => {
        $syncProgress.value += 1
    })
    const removedTrackIds = trackIdsBefore.difference(trackIdsAfter)

    batch(() => {
        $syncing.set(false)
        $tracks.map(findAndRemoveAll(t => removedTrackIds.has(t.id)))
    })
})
