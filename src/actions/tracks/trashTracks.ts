import { $tracks } from '@app/state/tracks/tracks'
import { $tracksById } from '@app/state/tracks/tracksById'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { action } from '@monstermann/signals'
import { invoke } from '@tauri-apps/api/core'

export const trashTracks = action(async (trackIds: string[]) => {
    const paths = trackIds
        .map(tid => $tracksById(tid)())
        .filter(t => !!t)
        .map(t => t.path)

    if (!paths.length) return

    if (import.meta.env.PROD) {
        const ok = await invoke<boolean>('trash_files', { filePaths: paths }).catch(() => false)
        if (!ok) return
    }

    $tracks.map(findAndRemoveAll(t => trackIds.includes(t.id)))
})
