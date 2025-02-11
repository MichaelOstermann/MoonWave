import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import type { Dialog, ModalStatus } from './types'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { setEntry } from '../data/setEntry'
import { changeEffect } from '../signals/changeEffect'
import { withCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
import { event } from '../signals/event'
import { signal } from '../signals/signal'
import { modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

export function createDialog(
    id: string,
    render: (props: { dialog: Dialog }) => ReactNode,
): Dialog {
    const isOpen = signal(false)
    const status = signal<ModalStatus>('closed')
    const floatingElement = signal<HTMLElement>(null)
    const mounted = computed(() => isOpen() || status() !== 'closed')

    let container: HTMLDivElement | void
    let root: Root | void

    const dialog: Dialog = {
        type: 'dialog',
        id,
        isOpen,
        status,
        floatingElement,
        open,
        close,
        onOpen: event(),
        onClose: event(),
        onOpening: event(),
        onOpened: event(),
        onClosing: event(),
        onClosed: event(),
    }

    function open() {
        isOpen.set(true)
    }

    function close() {
        isOpen.set(false)
    }

    changeEffect(mounted, (mounted) => {
        if (!mounted) return
        container = document.createElement('div')
        root = createRoot(container)
        document.body.appendChild(container)
        root.render(createElement(render, { dialog }))
        withCleanup(() => queueMicrotask(() => {
            root = root?.unmount()
            container = container?.remove()
        }))
    })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) {
            dialog.onOpen.emit(dialog)
            onOpenModal.emit(dialog)
        }
        else {
            dialog.onClose.emit(dialog)
            onCloseModal.emit(dialog)
        }
    })

    changeEffect(status, (status) => {
        if (status === 'opening') {
            dialog.onOpening.emit(dialog)
            onOpeningModal.emit(dialog)
        }
        else if (status === 'opened') {
            dialog.onOpened.emit(dialog)
            onOpenedModal.emit(dialog)
        }
        else if (status === 'closing') {
            dialog.onClosing.emit(dialog)
            onClosingModal.emit(dialog)
        }
        else if (status === 'closed') {
            dialog.onClosed.emit(dialog)
            onClosedModal.emit(dialog)
        }
    })

    modals.map(setEntry(id, dialog))

    return dialog
}
