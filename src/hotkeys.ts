import { playNext } from "#actions/audio/playNext"
import { playPrev } from "#actions/audio/playPrev"
import { seekBackward } from "#actions/audio/seekBackward"
import { seekForward } from "#actions/audio/seekForward"
import { onDoubleClickPlaylist } from "#actions/playlists/onDoubleClickPlaylist"
import { onDoubleClickTrack } from "#actions/tracks/onDoubleClickTrack"
import { shortcuts } from "#config/shortcuts"
import { LSM } from "#features/LSM"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { Views } from "#features/Views"
import { match } from "@monstermann/fn"
import { Hotkeys } from "@monstermann/hotkeys"
import { focusSearchInput } from "./actions/app/focusSearchInput"
import { syncLibrary } from "./actions/app/syncLibrary"
import { setVolume } from "./actions/audio/setVolume"
import { toggleMode } from "./actions/audio/toggleMode"
import { toggleMute } from "./actions/audio/toggleMute"
import { togglePlayback } from "./actions/audio/togglePlayback"
import { createPlaylist } from "./actions/playlists/createPlaylist"
import { Modals } from "./features/Modals"

Hotkeys.bindings.clear()

function bind(shortcuts: string[], callback: () => void): void {
    for (const shortcut of shortcuts) {
        Hotkeys.bind(shortcut, callback)
    }
}

bind(shortcuts.createPlaylist, () => createPlaylist())
bind(shortcuts.focusSearchInput, focusSearchInput)
bind(shortcuts.playNext, playNext)
bind(shortcuts.playPrev, playPrev)
bind(shortcuts.reload, () => window.location.reload())
bind(shortcuts.seekBackward, () => seekBackward(undefined))
bind(shortcuts.seekForward, () => seekForward(undefined))
bind(shortcuts.setVolume10, () => setVolume(0.1))
bind(shortcuts.setVolume20, () => setVolume(0.2))
bind(shortcuts.setVolume30, () => setVolume(0.3))
bind(shortcuts.setVolume40, () => setVolume(0.4))
bind(shortcuts.setVolume50, () => setVolume(0.5))
bind(shortcuts.setVolume60, () => setVolume(0.6))
bind(shortcuts.setVolume70, () => setVolume(0.7))
bind(shortcuts.setVolume80, () => setVolume(0.8))
bind(shortcuts.setVolume90, () => setVolume(0.9))
bind(shortcuts.setVolume100, () => setVolume(1))
bind(shortcuts.showCmdMenu, () => Modals.CommandMenu.open())
bind(shortcuts.showCmdMenu, () => Modals.CommandMenu.open())
bind(shortcuts.syncLibrary, syncLibrary)
bind(shortcuts.toggleMode, toggleMode)
bind(shortcuts.toggleMute, toggleMute)
bind(shortcuts.togglePlayback, togglePlayback)

bind(shortcuts.playSelected, () => match(Views.$focused())
    .onCase("MAIN", () => {
        const tid = LSM.getLastSelection(TrackList.$LSM())
        if (!tid) return
        onDoubleClickTrack(tid)
    })
    .onCase("SIDEBAR", () => {
        const view = LSM.getLastSelection(Sidebar.$LSM())
        if (!view) return
        onDoubleClickPlaylist(view)
    })
    .orThrow())

bind(shortcuts.switchFocus, () => match(Views.$focused())
    .onCase("MAIN", () => Views.$focused("SIDEBAR"))
    .onCase("SIDEBAR", () => Views.$focused("MAIN"))
    .orThrow())

bind(shortcuts.goToPrev, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.goToPrev))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.goToPrev))
    .orThrow())

bind(shortcuts.goToNext, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.goToNext))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.goToNext))
    .orThrow())

bind(shortcuts.goToTop, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.goToTop))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.goToTop))
    .orThrow())

bind(shortcuts.goToBottom, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.goToBottom))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.goToBottom))
    .orThrow())

bind(shortcuts.selectPrev, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.selectPrev))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.selectPrev))
    .orThrow())

bind(shortcuts.selectNext, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.selectNext))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.selectNext))
    .orThrow())

bind(shortcuts.selectAll, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.selectAll))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.selectAll))
    .orThrow())

bind(shortcuts.selectToTop, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.selectToTop))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.selectToTop))
    .orThrow())

bind(shortcuts.selectToBottom, () => match(Views.$focused())
    .onCase("MAIN", () => TrackList.$LSM(LSM.selectToBottom))
    .onCase("SIDEBAR", () => Sidebar.$LSM(LSM.selectToBottom))
    .orThrow())
