import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import type { Dialog, ModalStatus } from './types'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { setEntry } from '../data/setEntry'
import { changeEffect } from '../signals/changeEffect'
import { onCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
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
        onCleanup(() => queueMicrotask(() => {
            root = root?.unmount()
            container = container?.remove()
        }))
    })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) onOpenModal(dialog)
        else onCloseModal(dialog)
    })

    changeEffect(status, (status) => {
        if (status === 'opening') onOpeningModal(dialog)
        else if (status === 'opened') onOpenedModal(dialog)
        else if (status === 'closing') onClosingModal(dialog)
        else if (status === 'closed') onClosedModal(dialog)
    })

    modals.map(setEntry(id, dialog))

    return dialog
}
