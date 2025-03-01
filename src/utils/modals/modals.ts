import type { Dialog, Modal, Popover, Tooltip } from './types'
import { shallowEqualArrays } from 'shallow-equal'
import { isParentElementOf } from '../dom/isParentElementOf'
import { onCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
import { effect } from '../signals/effect'
import { event } from '../signals/event'
import { onEvent } from '../signals/onEvent'
import { signal } from '../signals/signal'

export const onOpenModal = event<Modal>()
export const onCloseModal = event<Modal>()
export const onOpeningModal = event<Modal>()
export const onOpenedModal = event<Modal>()
export const onClosingModal = event<Modal>()
export const onClosedModal = event<Modal>()

export const modals = signal(new Map<string, Modal>())

export const openModals = computed(() => {
    return Array
        .from(modals().values())
        .filter(m => m.isOpen())
}, { equals: shallowEqualArrays })

export const openDialogs = computed(() => {
    return openModals().filter(m => m.type === 'dialog')
}, { equals: shallowEqualArrays })

export const openPopovers = computed(() => {
    return openModals().filter(m => m.type === 'popover')
}, { equals: shallowEqualArrays })

export const openTooltips = computed(() => {
    return openModals().filter(m => m.type === 'tooltip')
}, { equals: shallowEqualArrays })

export const hasOpenModals = computed(() => openModals().length > 0)
export const hasOpenDialogs = computed(() => openDialogs().length > 0)
export const hasOpenPopovers = computed(() => openPopovers().length > 0)
export const hasOpenTooltips = computed(() => openTooltips().length > 0)

export function getModal(id: string): Modal | undefined {
    return modals().get(id)
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

export function openModal(id: string): void {
    return modals.peek().get(id)?.open()
}

export function closeModal(id: string): void {
    return modals.peek().get(id)?.close()
}

export function isModalOpen(id: string): boolean {
    return modals().get(id)?.isOpen() === true
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
