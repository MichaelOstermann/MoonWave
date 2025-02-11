import type { EventCallback } from '../signals/event'
import type { Popover, PopoverOptions } from './types'
import { useEffect } from 'react'
import { createPopover } from './createPopover'

export function usePopover(
    id: string,
    options: Partial<PopoverOptions & {
        onOpen: EventCallback<Popover>
        onClose: EventCallback<Popover>
        onOpening: EventCallback<Popover>
        onOpened: EventCallback<Popover>
        onClosing: EventCallback<Popover>
        onClosed: EventCallback<Popover>
    }> = {},
): Popover {
    const { onOpen, onClose, onOpening, onOpened, onClosing, onClosed, ...opts } = options
    const popover = createPopover(id, opts)

    useEffect(() => onOpen && popover.onOpen(onOpen))
    useEffect(() => onClose && popover.onClose(onClose))
    useEffect(() => onOpening && popover.onOpening(onOpening))
    useEffect(() => onOpened && popover.onOpened(onOpened))
    useEffect(() => onClosing && popover.onClosing(onClosing))
    useEffect(() => onClosed && popover.onClosed(onClosed))
    useEffect(() => popover.register(), [popover])

    return popover
}
