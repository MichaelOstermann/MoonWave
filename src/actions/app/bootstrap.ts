import type { Library } from "#src/features/Library"
import { App } from "#features/App"
import { Config } from "#features/Config"
import { Fs } from "#features/Fs"
import { Playlists } from "#features/Playlists"
import { Tracks } from "#features/Tracks"
import { match, Promise } from "@monstermann/fn"
import { action, batch, watch } from "@monstermann/signals"
import { onKeyDown } from "@monstermann/signals-web"
import { listen } from "@tauri-apps/api/event"
import { audioDir, dataDir, homeDir } from "@tauri-apps/api/path"
import { Effect, EffectState, getCurrentWindow } from "@tauri-apps/api/window"
import { BaseDirectory } from "@tauri-apps/plugin-fs"
import { onDragEnterFiles } from "./onDragEnterFiles"
import { onDragLeaveFiles } from "./onDragLeaveFiles"
import { onDragOverFiles } from "./onDragOverFiles"
import { onDropFiles } from "./onDropFiles"
import { onMprisEvent } from "./onMprisEvent"
import { onPlaybackEvent } from "./onPlaybackEvent"
import { syncLibrary } from "./syncLibrary"
import { triggerHotkey } from "./triggerHotkey"

let didBootstrap = false
const saveConfig = Promise.debounce((config: Config) => Fs.writeJSON("config.json", config, { baseDir: BaseDirectory.AppData }), { wait: 1000 })
const saveLibrary = Promise.debounce((library: Library) => Fs.writeJSON("library.json", library, { baseDir: BaseDirectory.AppData }), { wait: 1000 })

export const bootstrap = action(async () => {
    if (didBootstrap) return
    didBootstrap = true

    const tauri = getCurrentWindow()

    onKeyDown(triggerHotkey)

    listen("playback", (event: any) => onPlaybackEvent(event.payload))
    listen("mpris-event", (event: any) => onMprisEvent(event.payload))

    tauri.onDragDropEvent(({ payload }) => {
        match
            .shape(payload)
            .onCase({ type: "enter" }, payload => onDragEnterFiles(payload.paths))
            .onCase({ type: "over" }, payload => onDragOverFiles(payload.position))
            .onCase({ type: "drop" }, onDropFiles)
            .onCase({ type: "leave" }, onDragLeaveFiles)
            .orThrow()
    })

    const [
        config,
        library,
        homePath,
        audioPath,
        dataPath,
        isFocused,
        isMinimized,
    ] = await Promise.all([
        Fs.readJSON<Config>("config.json", { baseDir: BaseDirectory.AppData }),
        Fs.readJSON<Library>("library.json", { baseDir: BaseDirectory.AppData }),
        homeDir(),
        audioDir(),
        dataDir(),
        tauri.isFocused(),
        tauri.isMinimized(),
    ])

    batch(() => {
        Config.$config(config ?? {})
        Tracks.$all(library?.tracks ?? [])
        Playlists.$all(library?.playlists ?? [])
        Fs.$homeDir(homePath)
        Fs.$audioDir(audioPath)
        Fs.$dataDir(dataPath)
        App.$isFocused(isFocused)
        App.$isMinimized(isMinimized)
        App.$didLoadLibrary(true)
    })

    if (import.meta.env.PROD) {
        watch(Config.$config, saveConfig)
        watch(() => ({ playlists: Playlists.$all(), tracks: Tracks.$all() }), saveLibrary)
        syncLibrary()
    }

    await tauri.setEffects({
        effects: [Effect.Sidebar],
        radius: 10,
        state: EffectState.Active,
    })

    await Promise.wait(100)
    await getCurrentWindow().show()

    // if (import.meta.env.PROD) {
    //     checkForUpdates()
    //     periodicallyCheckForUpdates()
    // }
})
