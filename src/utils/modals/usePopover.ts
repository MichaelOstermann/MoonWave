import type { Popover, PopoverOptions } from './types'
import { useEffect } from 'react'
import { createPopover } from './createPopover'

export function usePopover(
    id: string,
    options: Partial<PopoverOptions> = {},
): Popover {
    const popover = createPopover(id, options)
    useEffect(() => popover.register(), [popover])
    return popover
}
