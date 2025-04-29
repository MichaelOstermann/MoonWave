import { Hotkeys } from "@monstermann/hotkeys"
import { action } from "@monstermann/signals"

export const triggerHotkey = action((event: KeyboardEvent) => {
    const hotkeys = Hotkeys.evt(event)
    const isInInput = document.activeElement?.nodeName === "INPUT"
        || document.activeElement?.nodeName === "TEXTAREA"

    if (isInInput) {
        if (Hotkeys.isExactMatch(hotkeys, "ctrl+a")) return
        if (Hotkeys.isExactMatch(hotkeys, "ctrl+up")) return
        if (Hotkeys.isExactMatch(hotkeys, "ctrl+down")) return
        if (Hotkeys.isExactMatch(hotkeys, "ctrl+left")) return
        if (Hotkeys.isExactMatch(hotkeys, "ctrl+right")) return

        if (Hotkeys.isExactMatch(hotkeys, "cmd+a")) return
        if (Hotkeys.isExactMatch(hotkeys, "cmd+up")) return
        if (Hotkeys.isExactMatch(hotkeys, "cmd+down")) return
        if (Hotkeys.isExactMatch(hotkeys, "cmd+left")) return
        if (Hotkeys.isExactMatch(hotkeys, "cmd+right")) return
    }

    const bindings = Array
        .from(Hotkeys.bindings)
        .filter(binding => Hotkeys.isExactMatch(binding.hotkeys, hotkeys))
        .filter((binding) => {
            if (!isInInput) return true
            const hotkey = binding.hotkeys[0]
            return hotkey?.ctrl || hotkey?.meta || false
        })

    if (bindings.length) event.preventDefault()
    bindings.forEach(binding => binding.callback())
})
