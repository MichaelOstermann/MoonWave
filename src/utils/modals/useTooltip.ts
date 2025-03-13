import type { Tooltip, TooltipOptions } from './types'
import { useEffect, useId } from 'react'
import { createTooltip } from './createTooltip'

export function useTooltip(
    id?: string,
    options: Partial<TooltipOptions> = {},
): Tooltip {
    const fallbackId = useId()
    const tooltip = createTooltip(id ?? fallbackId, options)
    useEffect(() => tooltip.register(), [tooltip])
    return tooltip
}
