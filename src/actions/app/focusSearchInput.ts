import { action } from "@monstermann/signals"

export const focusSearchInput = action(() => {
    const input = document.querySelector(".sidebar-search-input") as HTMLInputElement | undefined
    input?.focus()
})
