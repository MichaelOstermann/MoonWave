import type { ReadonlySignal, WritableSignal } from '@monstermann/signals'

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
    enableArrow: boolean
}

export type Popover = {
    type: 'popover'
    id: string
    isOpen: WritableSignal<boolean>
    status: WritableSignal<ModalStatus>
    offset: WritableSignal<number>
    borderWidth: WritableSignal<number>
    paddingTop: WritableSignal<number>
    paddingLeft: WritableSignal<number>
    paddingRight: WritableSignal<number>
    paddingBottom: WritableSignal<number>
    arrowWidth: WritableSignal<number>
    arrowHeight: WritableSignal<number>
    arrowRadius: WritableSignal<number>
    anchorElement: WritableSignal<HTMLElement | null>
    floatingElement: WritableSignal<HTMLElement | null>
    maxHeight: ReadonlySignal<number>
    placement: ReadonlySignal<PopoverPlacement>
    x: ReadonlySignal<number>
    y: ReadonlySignal<number>
    arrowX: ReadonlySignal<number>
    arrowY: ReadonlySignal<number>
    originX: ReadonlySignal<number>
    originY: ReadonlySignal<number>
    open: () => Promise<void>
    close: () => Promise<void>
    register: () => () => void
}

export type TooltipOptions = {
    offset: number
    paddingTop: number
    paddingLeft: number
    paddingRight: number
    paddingBottom: number
}

export type Tooltip = {
    type: 'tooltip'
    id: string
    isOpen: WritableSignal<boolean>
    status: WritableSignal<ModalStatus>
    offset: WritableSignal<number>
    paddingTop: WritableSignal<number>
    paddingLeft: WritableSignal<number>
    paddingRight: WritableSignal<number>
    paddingBottom: WritableSignal<number>
    anchorElement: WritableSignal<HTMLElement | null>
    floatingElement: WritableSignal<HTMLElement | null>
    maxHeight: ReadonlySignal<number>
    placement: ReadonlySignal<PopoverPlacement>
    x: ReadonlySignal<number>
    y: ReadonlySignal<number>
    originX: ReadonlySignal<number>
    originY: ReadonlySignal<number>
    open: () => Promise<void>
    close: () => Promise<void>
    register: () => () => void
}

export type Dialog = {
    type: 'dialog'
    id: string
    isOpen: WritableSignal<boolean>
    status: WritableSignal<ModalStatus>
    floatingElement: WritableSignal<HTMLElement | null>
    open: () => Promise<void>
    close: () => Promise<void>
}

export type Modal =
    | Popover
    | Dialog
    | Tooltip
