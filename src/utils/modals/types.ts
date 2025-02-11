import type { ReadonlySignal } from '../signals/computed'
import type { Event } from '../signals/event'
import type { Signal } from '../signals/signal'

export type ModalStatus =
    | 'opening'
    | 'opened'
    | 'closing'
    | 'closed'

export type PopoverPlacement =
    | 'above'
    | 'below'

export type PopoverOptions = {
    offset: number
    borderWidth: number
    paddingTop: number
    paddingLeft: number
    paddingRight: number
    paddingBottom: number
    arrowWidth: number
    arrowHeight: number
    arrowRadius: number
}

export type Popover = {
    type: 'popover'
    id: string
    isOpen: Signal<boolean>
    status: Signal<ModalStatus>
    offset: Signal<number>
    borderWidth: Signal<number>
    paddingTop: Signal<number>
    paddingLeft: Signal<number>
    paddingRight: Signal<number>
    paddingBottom: Signal<number>
    arrowWidth: Signal<number>
    arrowHeight: Signal<number>
    arrowRadius: Signal<number>
    anchorElement: Signal<HTMLElement | null>
    floatingElement: Signal<HTMLElement | null>
    hasMeasurements: ReadonlySignal<boolean>
    maxHeight: ReadonlySignal<number>
    placement: ReadonlySignal<PopoverPlacement>
    x: ReadonlySignal<number>
    y: ReadonlySignal<number>
    arrowX: ReadonlySignal<number>
    arrowY: ReadonlySignal<number>
    originX: ReadonlySignal<number>
    originY: ReadonlySignal<number>
    open: () => void
    close: () => void
    register: () => () => void
    onOpen: Event<Popover>
    onClose: Event<Popover>
    onOpening: Event<Popover>
    onOpened: Event<Popover>
    onClosing: Event<Popover>
    onClosed: Event<Popover>
}

export type Dialog = {
    type: 'dialog'
    id: string
    isOpen: Signal<boolean>
    status: Signal<ModalStatus>
    floatingElement: Signal<HTMLElement | null>
    open: () => void
    close: () => void
    onOpen: Event<Dialog>
    onClose: Event<Dialog>
    onOpening: Event<Dialog>
    onOpened: Event<Dialog>
    onClosing: Event<Dialog>
    onClosed: Event<Dialog>
}

export type Modal =
    | Popover
    | Dialog
