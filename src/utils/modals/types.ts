import type { ReadonlySignal } from '../signals/computed'
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
    enabled: boolean
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
    isEnabled: Signal<boolean>
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
}

export type TooltipOptions = {
    enabled: boolean
    offset: number
    paddingTop: number
    paddingLeft: number
    paddingRight: number
    paddingBottom: number
}

export type Tooltip = {
    type: 'tooltip'
    id: string
    isOpen: Signal<boolean>
    isEnabled: Signal<boolean>
    status: Signal<ModalStatus>
    offset: Signal<number>
    paddingTop: Signal<number>
    paddingLeft: Signal<number>
    paddingRight: Signal<number>
    paddingBottom: Signal<number>
    anchorElement: Signal<HTMLElement | null>
    floatingElement: Signal<HTMLElement | null>
    hasMeasurements: ReadonlySignal<boolean>
    maxHeight: ReadonlySignal<number>
    placement: ReadonlySignal<PopoverPlacement>
    x: ReadonlySignal<number>
    y: ReadonlySignal<number>
    originX: ReadonlySignal<number>
    originY: ReadonlySignal<number>
    open: () => void
    close: () => void
    register: () => () => void
}

export type Dialog = {
    type: 'dialog'
    id: string
    isOpen: Signal<boolean>
    status: Signal<ModalStatus>
    floatingElement: Signal<HTMLElement | null>
    open: () => void
    close: () => void
}

export type Modal =
    | Popover
    | Dialog
    | Tooltip
