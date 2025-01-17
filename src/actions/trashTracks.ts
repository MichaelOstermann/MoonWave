import { $tracks, $tracksById } from '@app/state/state'
import { findAndRemoveAll } from '@app/utils/data/findAndRemoveAll'
import { action } from '@app/utils/signals/action'
import { invoke } from '@tauri-apps/api/core'

export const trashTracks = action(async (trackIds: string[]) => {
    const paths = trackIds
        .map(tid => $tracksById(tid).value)
        .filter(t => !!t)
        .map(t => t.path)

    if (!paths.length) return

    const ok = await invoke<boolean>('trash_files', { filePaths: paths }).catch(() => false)
    if (!ok) return

    $tracks.map(findAndRemoveAll(t => trackIds.includes(t.id)))
})
