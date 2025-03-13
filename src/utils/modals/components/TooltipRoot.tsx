import type { ComponentProps, ReactNode } from 'react'
import type { Tooltip } from '../types'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@monstermann/signals'
import { Portal } from '@radix-ui/react-portal'
import { twJoin, twMerge } from 'tailwind-merge'
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
    const x = useSignal(tooltip.x)
    const y = useSignal(tooltip.y)
    const originX = useSignal(tooltip.originX)
    const originY = useSignal(tooltip.originY)
    const maxHeight = useSignal(tooltip.maxHeight)

    const transition = useTransition({
        isOpen,
        openDuration: 300,
        closeDuration: 300,
        onChange: tooltip.status.set,
    })

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                ref={el => void tooltip.floatingElement.set(el)}
                onClick={evt => evt.stopPropagation()}
                onPointerDown={evt => evt.stopPropagation()}
                onContextMenu={evt => evt.stopPropagation()}
                style={{ top: y, left: x }}
                className={twJoin('modal tooltip absolute flex', transition.status)}
            >
                <div
                    {...rest}
                    className={twMerge(
                        'floating relative flex h-7 items-center rounded bg-[--bg] px-2 text-xs font-medium text-[--fg] backdrop-blur-xl',
                        className,
                    )}
                    style={{
                        ...transition.style({
                            open: { opacity: 1, transform: 'scale(1)' },
                            close: { opacity: 0, transform: 'scale(0.75)' },
                        }),
                        ...style,
                        maxHeight,
                        transformOrigin: `${originX}px ${originY}px`,
                    }}
                >
                    {render()}
                </div>
            </div>
        </Portal>
    )
}
