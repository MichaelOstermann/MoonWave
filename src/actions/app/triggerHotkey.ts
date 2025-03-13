import { hotkeys } from '@app/hotkeys'
import { pipe } from '@app/utils/data/pipe'
import { eventToHotkey, getExactBindings, resolveBindings } from '@monstermann/hotkeys'
import { action } from '@monstermann/signals'

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
