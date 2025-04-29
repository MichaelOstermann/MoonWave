import { action } from "@monstermann/signals"
import { open } from "@tauri-apps/plugin-dialog"
import { importFiles } from "./importFiles"

export const selectAndImportFiles = action(async ({ playlistId }: { playlistId: string | undefined }) => {
    const paths = await open({ directory: true, multiple: true })
    if (!paths) return
    importFiles({ paths, playlistId })
})
