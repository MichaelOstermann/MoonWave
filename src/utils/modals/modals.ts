import type { Dialog, Modal, Popover, Tooltip } from './types'
import { computed, effect, event, onCleanup, onEvent, signal } from '@monstermann/signals'
import { isParentElementOf } from '../dom/isParentElementOf'

export const onOpenModal = event<Modal>()
export const onCloseModal = event<Modal>()
export const onOpeningModal = event<Modal>()
export const onOpenedModal = event<Modal>()
export const onClosingModal = event<Modal>()
export const onClosedModal = event<Modal>()

export const modals = new Map<string, Modal>()
export const openModals = signal<Modal[]>([])
export const openDialogs = computed(() => openModals().filter(m => m.type === 'dialog'))
export const openPopovers = computed(() => openModals().filter(m => m.type === 'popover'))
export const openTooltips = computed(() => openModals().filter(m => m.type === 'tooltip'))

export const hasOpenModals = computed(() => openModals().length > 0)
export const hasOpenDialogs = computed(() => openDialogs().length > 0)
export const hasOpenPopovers = computed(() => openPopovers().length > 0)
export const hasOpenTooltips = computed(() => openTooltips().length > 0)

export function getModal(id: string): Modal | undefined {
    return modals.get(id)
}

export function getDialog(id: string): Dialog | undefined {
    const modal = getModal(id)
    return modal?.type === 'dialog' ? modal : undefined
}

export function getPopover(id: string): Popover | undefined {
    const modal = getModal(id)
    return modal?.type === 'popover' ? modal : undefined
}

export function getTooltip(id: string): Tooltip | undefined {
    const modal = getModal(id)
    return modal?.type === 'tooltip' ? modal : undefined
}

export async function openModal(id: string): Promise<void> {
    return modals.get(id)?.open()
}

export async function closeModal(id: string): Promise<void> {
    return modals.get(id)?.close()
}

export function isModalOpen(id: string): boolean {
    return modals.get(id)?.isOpen() === true
}

export function closeAllModals(): void {
    openModals.peek().forEach(m => m.close())
}

export function closeAllModalsExcept(modal: Modal): void {
    for (const openModal of openModals()) {
        if (openModal === modal) continue
        openModal.close()
    }
}

export function closeAllDialogs(): void {
    openDialogs.peek().forEach(m => m.close())
}

export function closeAllDialogsExcept(dialog: Dialog): void {
    for (const openDialog of openDialogs()) {
        if (openDialog === dialog) continue
        openDialog.close()
    }
}

export function closeAllPopovers(): void {
    openPopovers.peek().forEach(m => m.close())
}

export function closeAllPopoversExcept(popover: Popover): void {
    for (const openPopover of openPopovers()) {
        if (openPopover === popover) continue
        openPopover.close()
    }
}

export function closeAllTooltips(): void {
    openTooltips.peek().forEach(m => m.close())
}

export function closeAllTooltipsExcept(tooltip: Tooltip): void {
    for (const openTooltip of openTooltips()) {
        if (openTooltip === tooltip) continue
        openTooltip.close()
    }
}

onEvent(onOpenModal, (modal) => {
    openModals.map(m => [...m, modal])
})

onEvent(onCloseModal, (modal) => {
    openModals.map(m => m.filter(m => m !== modal))
})

onEvent(onOpenModal, (modal) => {
    if (modal.type === 'tooltip') return
    closeAllModalsExcept(modal)
})

onEvent(onOpenModal, (modal) => {
    if (modal.type !== 'tooltip') return
    closeAllTooltipsExcept(modal)
})

effect(() => {
    if (hasOpenPopovers()) document.body.setAttribute('has-popover', 'true')
    else document.body.removeAttribute('has-popover')
})

effect(() => {
    if (!hasOpenModals()) return

    const ac = new AbortController()

    document.addEventListener('mousedown', (evt) => {
        const lastModal = openModals().at(-1)
        const floatingElement = lastModal?.floatingElement()
        const targetElement = evt.target as Element
        if (!floatingElement) return
        const shouldClose = targetElement !== floatingElement
            && !isParentElementOf(floatingElement, targetElement)
        if (shouldClose) lastModal?.close()
    }, { signal: ac.signal })

    document.addEventListener('keydown', (evt) => {
        if (evt.key !== 'Escape') return
        const lastModal = openModals().at(-1)
        const floatingElement = lastModal?.floatingElement()
        if (!floatingElement) return
        const targetElement = evt.target as Element
        const shouldSkip = (targetElement.nodeName === 'INPUT' && (targetElement as HTMLInputElement).value)
            || (targetElement.nodeName === 'TEXTAREA' && (targetElement as HTMLTextAreaElement).value)
        if (!shouldSkip) lastModal?.close()
    }, { capture: true, signal: ac.signal })

    onCleanup(() => ac.abort())
})
