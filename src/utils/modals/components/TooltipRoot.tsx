import type { ComponentProps, ReactNode } from 'react'
import type { Tooltip } from '../types'
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

    const { mounted, status, isOpenedOrOpening, isClosedOrClosing } = useTransition({
        isOpen,
        openDuration: 300,
        closeDuration: 200,
        onChange: tooltip.status.set,
    })

    if (!mounted) return null

    return (
        <Portal asChild>
            <div
                ref={el => void tooltip.floatingElement.set(el)}
                data-modal="tooltip"
                data-modal-status={status}
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
                            'relative flex rounded bg-[--bg] px-2 py-1 text-xs font-semibold text-[--fg] backdrop-blur-xl transition',
                            isClosedOrClosing && 'scale-90 opacity-0 duration-200',
                            isOpenedOrOpening && 'scale-100 opacity-100 duration-300',
                            className,
                        )}
                        style={{
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
