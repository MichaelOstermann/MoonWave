import { createModal, withFloatingElement, withModalGroups, withModalStatus } from "@monstermann/signals-modal"

export type Dialog = typeof CommandMenu

export const CommandMenu = createModal("CommandMenu", () => {
    const $groups = withModalGroups(["dialog"])
    const { $isOpen, $status, close, open } = withModalStatus()
    const $floatingElement = withFloatingElement()
    return { $floatingElement, $groups, $isOpen, $status, close, open }
})
