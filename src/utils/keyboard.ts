import type { FocusedView } from '@app/types'
import { createPlaylist } from '@app/actions/createPlaylist'
import { setVolume } from '@app/actions/setVolume'
import { syncLibrary } from '@app/actions/syncLibrary'
import { toggleMode } from '@app/actions/toggleMode'
import { toggleMute } from '@app/actions/toggleMute'
import { togglePlayback } from '@app/actions/togglePlayback'
import { shortcuts } from '@app/config/shortcuts'
import { $focusedView, $showCommandMenu, $sidebarLSM, $tracksLSM } from '@app/state/state'
import { createHotkeys, eventToHotkey, getExactBindings, resolveBindings } from '@monstermann/hotkeys'
import { addShortcuts } from '@monstermann/hotkeys/vscode'
import { pipeInto } from 'ts-functional-pipe'
import { goToBottom } from './lsm/utils/goToBottom'
import { goToNext } from './lsm/utils/goToNext'
import { goToPrev } from './lsm/utils/goToPrev'
import { goToTop } from './lsm/utils/goToTop'
import { selectAll } from './lsm/utils/selectAll'
import { selectNext } from './lsm/utils/selectNext'
import { selectPrev } from './lsm/utils/selectPrev'
import { selectToBottom } from './lsm/utils/selectToBottom'
import { selectToTop } from './lsm/utils/selectToTop'

const h = createHotkeys(config => config
    .bindingContext<{ allowInDialogs?: boolean }>()
    .bindingContext<{ allowInInputs?: boolean }>()
    .bindingContext<{ view?: FocusedView }>()
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.allowInDialogs !== false
            || $showCommandMenu.value === false
    }))
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.allowInInputs !== false
            || !['INPUT', 'TEXTAREA'].includes(document.activeElement?.nodeName as any)
    }))
    .resolveBindings(bindings => bindings.filter((binding) => {
        return binding.context.view === undefined
            || ($focusedView.value === binding.context.view && $showCommandMenu.value === false)
    })))

addShortcuts(h, ['cmd+shift+r'], () => window.location.reload())

addShortcuts(h, shortcuts.showCmdMenu, () => $showCommandMenu.map(v => !v))
addShortcuts(h, shortcuts.createPlaylist, createPlaylist)
addShortcuts(h, shortcuts.syncLibrary, syncLibrary)
addShortcuts(h, shortcuts.toggleMute, toggleMute)
addShortcuts(h, shortcuts.setVolume10, () => setVolume(0.1))
addShortcuts(h, shortcuts.setVolume20, () => setVolume(0.2))
addShortcuts(h, shortcuts.setVolume30, () => setVolume(0.3))
addShortcuts(h, shortcuts.setVolume40, () => setVolume(0.4))
addShortcuts(h, shortcuts.setVolume50, () => setVolume(0.5))
addShortcuts(h, shortcuts.setVolume60, () => setVolume(0.6))
addShortcuts(h, shortcuts.setVolume70, () => setVolume(0.7))
addShortcuts(h, shortcuts.setVolume80, () => setVolume(0.8))
addShortcuts(h, shortcuts.setVolume90, () => setVolume(0.9))
addShortcuts(h, shortcuts.setVolume100, () => setVolume(1))
addShortcuts(h, shortcuts.toggleMode, toggleMode)
addShortcuts(h, shortcuts.togglePlayback, togglePlayback, { allowInDialogs: false, allowInInputs: false })

addShortcuts(h, shortcuts.switchFocus, () => $focusedView.set('SIDEBAR'), { view: 'MAIN' })
addShortcuts(h, shortcuts.switchFocus, () => $focusedView.set('MAIN'), { view: 'SIDEBAR' })

addShortcuts(h, shortcuts.goToPrev, () => $tracksLSM.map(goToPrev), { view: 'MAIN' })
addShortcuts(h, shortcuts.goToNext, () => $tracksLSM.map(goToNext), { view: 'MAIN' })
addShortcuts(h, shortcuts.selectPrev, () => $tracksLSM.map(selectPrev), { view: 'MAIN' })
addShortcuts(h, shortcuts.selectNext, () => $tracksLSM.map(selectNext), { view: 'MAIN' })
addShortcuts(h, shortcuts.selectAll, () => $tracksLSM.map(selectAll), { view: 'MAIN', allowInInputs: false })
addShortcuts(h, shortcuts.goToTop, () => $tracksLSM.map(goToTop), { view: 'MAIN' })
addShortcuts(h, shortcuts.goToBottom, () => $tracksLSM.map(goToBottom), { view: 'MAIN' })
addShortcuts(h, shortcuts.selectToTop, () => $tracksLSM.map(selectToTop), { view: 'MAIN' })
addShortcuts(h, shortcuts.selectToBottom, () => $tracksLSM.map(selectToBottom), { view: 'MAIN' })

addShortcuts(h, shortcuts.goToPrev, () => $sidebarLSM.map(goToPrev), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.goToNext, () => $sidebarLSM.map(goToNext), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.selectPrev, () => $sidebarLSM.map(selectPrev), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.selectNext, () => $sidebarLSM.map(selectNext), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.selectAll, () => $sidebarLSM.map(selectAll), { view: 'SIDEBAR', allowInInputs: false })
addShortcuts(h, shortcuts.goToTop, () => $sidebarLSM.map(goToTop), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.goToBottom, () => $sidebarLSM.map(goToBottom), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.selectToTop, () => $sidebarLSM.map(selectToTop), { view: 'SIDEBAR' })
addShortcuts(h, shortcuts.selectToBottom, () => $sidebarLSM.map(selectToBottom), { view: 'SIDEBAR' })

document.addEventListener('keydown', (event) => {
    const hotkey = eventToHotkey(event)

    if (hotkey.key === ' ') hotkey.key = 'Space'

    const bindings = pipeInto(
        getExactBindings(h, [hotkey]),
        bindings => resolveBindings(h, bindings),
    )

    if (bindings.length) event.preventDefault()
    bindings.forEach(binding => binding.callback({}))
})
