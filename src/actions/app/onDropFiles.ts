import { App } from "#features/App"
import { Playlists } from "#features/Playlists"
import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"
import { importFiles } from "./importFiles"

export const onDropFiles = action(() => {
    const paths = App.$draggingFilePaths()
    const playlistId = Sidebar.$dropId() || Sidebar.$playlistId()
    App.$draggingFilePaths([])
    Playlists.bounce(playlistId)
    importFiles({ paths, playlistId })
})
