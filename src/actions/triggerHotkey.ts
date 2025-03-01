import { hotkeys } from '@app/hotkeys'
import { pipe } from '@app/utils/data/pipe'
import { action } from '@app/utils/signals/action'
import { eventToHotkey, getExactBindings, resolveBindings } from '@monstermann/hotkeys'

export const triggerHotkey = action((event: KeyboardEvent) => {
    const hotkey = eventToHotkey(event)

    if (hotkey.key === ' ') hotkey.key = 'Space'

    const bindings = pipe(
        getExactBindings(hotkeys, [hotkey]),
        bindings => resolveBindings(hotkeys, bindings),
    )

    if (bindings.length) event.preventDefault()
    bindings.forEach(binding => binding.callback({}))
})
