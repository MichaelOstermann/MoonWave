import type { Tooltip, TooltipOptions } from './types'
import { useEffect } from 'react'
import { createTooltip } from './createTooltip'

export function useTooltip(
    id: string,
    options: Partial<TooltipOptions> = {},
): Tooltip {
    const tooltip = createTooltip(id, options)
    useEffect(() => tooltip.register(), [tooltip])
    return tooltip
}
