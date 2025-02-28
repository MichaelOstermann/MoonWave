import type { ComponentProps, ReactNode } from 'react'
import type { Tooltip } from '../types'
import { glide } from '@app/config/easings'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@app/utils/signals/useSignal'
import { Portal } from '@radix-ui/react-portal'
import { twMerge } from 'tailwind-merge'
import './styles.css'

interface TooltipRootProps extends Omit<ComponentProps<'div'>, 'children' | 'popover'> {
    tooltip: Tooltip
    render: () => ReactNode
}

export function TooltipRoot({
    tooltip,
    style,
    className,
    render,
    ...rest
}: TooltipRootProps): ReactNode {
    const isOpen = useSignal(tooltip.isOpen)
    const hasMeasurements = useSignal(tooltip.hasMeasurements)
    const placement = useSignal(tooltip.placement)
    const x = useSignal(tooltip.x)
    const y = useSignal(tooltip.y)
    const originX = useSignal(tooltip.originX)
    const originY = useSignal(tooltip.originY)
    const maxHeight = useSignal(tooltip.maxHeight)

    const transition = useTransition({
        isOpen,
        easing: glide,
        openDuration: 300,
        closeDuration: 300,
        openClassName: 'scale-100 opacity-100',
        closeClassName: 'scale-75 opacity-0',
        onChange: tooltip.status.set,
    })

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                ref={el => void tooltip.floatingElement.set(el)}
                data-modal="tooltip"
                data-modal-status={transition.status}
                data-modal-placement={placement}
                onClick={evt => evt.stopPropagation()}
                onPointerDown={evt => evt.stopPropagation()}
                onContextMenu={evt => evt.stopPropagation()}
                style={{ top: y, left: x }}
                className="absolute flex"
            >
                {hasMeasurements && (
                    <div
                        {...rest}
                        className={twMerge(
                            transition.className,
                            'relative flex h-7 items-center rounded bg-[--bg] px-2 text-xs font-medium text-[--fg] backdrop-blur-xl',
                            className,
                        )}
                        style={{
                            ...transition.style,
                            ...style,
                            maxHeight,
                            transformOrigin: `${originX}px ${originY}px`,
                        }}
                    >
                        {render()}
                    </div>
                )}
            </div>
        </Portal>
    )
}
