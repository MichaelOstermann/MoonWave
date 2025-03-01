import type { FocusedView } from '@app/types'
import { createPlaylist } from '@app/actions/createPlaylist'
import { focusSearchInput } from '@app/actions/focusSearchInput'
import { setVolume } from '@app/actions/setVolume'
import { syncLibrary } from '@app/actions/syncLibrary'
import { toggleMode } from '@app/actions/toggleMode'
import { toggleMute } from '@app/actions/toggleMute'
import { togglePlayback } from '@app/actions/togglePlayback'
import { CommandMenu } from '@app/components/CommandMenu'
import { shortcuts } from '@app/config/shortcuts'
import { createHotkeys } from '@monstermann/hotkeys'
import { addShortcuts } from '@monstermann/hotkeys/vscode'
import { $focusedView } from './state/focusedView'
import { $sidebarLSM } from './state/sidebarLSM'
import { $tracksLSM } from './state/tracksLSM'
import { goToBottom } from './utils/lsm/utils/goToBottom'
import { goToNext } from './utils/lsm/utils/goToNext'
import { goToPrev } from './utils/lsm/utils/goToPrev'
import { goToTop } from './utils/lsm/utils/goToTop'
import { selectAll } from './utils/lsm/utils/selectAll'
import { selectNext } from './utils/lsm/utils/selectNext'
import { selectPrev } from './utils/lsm/utils/selectPrev'
import { selectToBottom } from './utils/lsm/utils/selectToBottom'
import { selectToTop } from './utils/lsm/utils/selectToTop'

export const hotkeys = createHotkeys(config => config
    .bindingContext<{ allowInDialogs?: boolean }>()
    .bindingContext<{ allowInInputs?: boolean }>()
    .bindingContext<{ view?: FocusedView }>()
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.allowInDialogs !== false
            || !CommandMenu.isOpen()
    }))
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.allowInInputs !== false
            || !['INPUT', 'TEXTAREA'].includes(document.activeElement?.nodeName as any)
    }))
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.view === undefined
            || ($focusedView() === binding.context.view && !CommandMenu.isOpen())
    })))

addShortcuts(hotkeys, ['cmd+shift+r'], () => window.location.reload())

addShortcuts(hotkeys, shortcuts.showCmdMenu, CommandMenu.open)
addShortcuts(hotkeys, shortcuts.createPlaylist, () => createPlaylist())
addShortcuts(hotkeys, shortcuts.syncLibrary, syncLibrary)
addShortcuts(hotkeys, shortcuts.toggleMute, toggleMute)
addShortcuts(hotkeys, shortcuts.setVolume10, () => setVolume(0.1))
addShortcuts(hotkeys, shortcuts.setVolume20, () => setVolume(0.2))
addShortcuts(hotkeys, shortcuts.setVolume30, () => setVolume(0.3))
addShortcuts(hotkeys, shortcuts.setVolume40, () => setVolume(0.4))
addShortcuts(hotkeys, shortcuts.setVolume50, () => setVolume(0.5))
addShortcuts(hotkeys, shortcuts.setVolume60, () => setVolume(0.6))
addShortcuts(hotkeys, shortcuts.setVolume70, () => setVolume(0.7))
addShortcuts(hotkeys, shortcuts.setVolume80, () => setVolume(0.8))
addShortcuts(hotkeys, shortcuts.setVolume90, () => setVolume(0.9))
addShortcuts(hotkeys, shortcuts.setVolume100, () => setVolume(1))
addShortcuts(hotkeys, shortcuts.toggleMode, toggleMode)
addShortcuts(hotkeys, shortcuts.togglePlayback, togglePlayback, { allowInDialogs: false, allowInInputs: false })

addShortcuts(hotkeys, shortcuts.focusSearchInput, focusSearchInput)
addShortcuts(hotkeys, shortcuts.switchFocus, () => $focusedView.set('SIDEBAR'), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.switchFocus, () => $focusedView.set('MAIN'), { view: 'SIDEBAR' })

addShortcuts(hotkeys, shortcuts.goToPrev, () => $tracksLSM.map(goToPrev), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.goToNext, () => $tracksLSM.map(goToNext), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.selectPrev, () => $tracksLSM.map(selectPrev), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.selectNext, () => $tracksLSM.map(selectNext), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.selectAll, () => $tracksLSM.map(selectAll), { view: 'MAIN', allowInInputs: false })
addShortcuts(hotkeys, shortcuts.goToTop, () => $tracksLSM.map(goToTop), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.goToBottom, () => $tracksLSM.map(goToBottom), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.selectToTop, () => $tracksLSM.map(selectToTop), { view: 'MAIN' })
addShortcuts(hotkeys, shortcuts.selectToBottom, () => $tracksLSM.map(selectToBottom), { view: 'MAIN' })

addShortcuts(hotkeys, shortcuts.goToPrev, () => $sidebarLSM.map(goToPrev), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.goToNext, () => $sidebarLSM.map(goToNext), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.selectPrev, () => $sidebarLSM.map(selectPrev), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.selectNext, () => $sidebarLSM.map(selectNext), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.selectAll, () => $sidebarLSM.map(selectAll), { view: 'SIDEBAR', allowInInputs: false })
addShortcuts(hotkeys, shortcuts.goToTop, () => $sidebarLSM.map(goToTop), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.goToBottom, () => $sidebarLSM.map(goToBottom), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.selectToTop, () => $sidebarLSM.map(selectToTop), { view: 'SIDEBAR' })
addShortcuts(hotkeys, shortcuts.selectToBottom, () => $sidebarLSM.map(selectToBottom), { view: 'SIDEBAR' })
