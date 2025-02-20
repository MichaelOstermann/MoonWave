import type { EventCallback } from '../signals/event'
import type { Tooltip, TooltipOptions } from './types'
import { useEffect } from 'react'
import { createTooltip } from './createTooltip'

export function useTooltip(
    id: string,
    options: Partial<TooltipOptions & {
        onOpen: EventCallback<Tooltip>
        onClose: EventCallback<Tooltip>
        onOpening: EventCallback<Tooltip>
        onOpened: EventCallback<Tooltip>
        onClosing: EventCallback<Tooltip>
        onClosed: EventCallback<Tooltip>
    }> = {},
): Tooltip {
    const { onOpen, onClose, onOpening, onOpened, onClosing, onClosed, ...opts } = options
    const tooltip = createTooltip(id, opts)

    useEffect(() => onOpen && tooltip.onOpen(onOpen))
    useEffect(() => onClose && tooltip.onClose(onClose))
    useEffect(() => onOpening && tooltip.onOpening(onOpening))
    useEffect(() => onOpened && tooltip.onOpened(onOpened))
    useEffect(() => onClosing && tooltip.onClosing(onClosing))
    useEffect(() => onClosed && tooltip.onClosed(onClosed))
    useEffect(() => tooltip.register(), [tooltip])

    return tooltip
}
