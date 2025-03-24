import type { ComponentProps, ReactNode } from 'react'
import type { Popover } from '../types'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@monstermann/signals'
import { Portal } from '@radix-ui/react-portal'
import { twJoin, twMerge } from 'tailwind-merge'
import { Arrow } from './Arrow'
import './styles.css'

interface PopoverProps extends Omit<ComponentProps<'div'>, 'children' | 'popover'> {
    popover: Popover
    render: () => ReactNode
}

export function PopoverRoot({
    popover,
    style,
    className,
    render,
    ...rest
}: PopoverProps): ReactNode {
    const isOpen = useSignal(popover.isOpen)
    const placement = useSignal(popover.placement)
    const x = useSignal(popover.x)
    const y = useSignal(popover.y)
    const arrowX = useSignal(popover.arrowX)
    const arrowY = useSignal(popover.arrowY)
    const originX = useSignal(popover.originX)
    const originY = useSignal(popover.originY)
    const arrowWidth = useSignal(popover.arrowWidth)
    const arrowHeight = useSignal(popover.arrowHeight)
    const arrowRadius = useSignal(popover.arrowRadius)
    const borderWidth = useSignal(popover.borderWidth)
    const maxHeight = useSignal(popover.maxHeight)

    const transition = useTransition({
        isOpen,
        openDuration: 500,
        closeDuration: 300,
        onChange: popover.status.set,
    })

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                ref={popover.floatingElement.set}
                onClick={evt => evt.stopPropagation()}
                onPointerDown={evt => evt.stopPropagation()}
                onContextMenu={evt => evt.stopPropagation()}
                style={{ top: y, left: x }}
                className={twJoin('modal popover absolute flex', transition.status)}
            >
                <div
                    {...rest}
                    className={twMerge(
                        'floating relative flex rounded-lg border-[--border] bg-[--bg] text-[--fg]',
                        className,
                    )}
                    style={{
                        ...transition.style({
                            open: { opacity: 1, transform: 'scale(1)' },
                            close: { opacity: 0, transform: 'scale(0.9)' },
                        }),
                        ...style,
                        maxHeight,
                        borderWidth,
                        transformOrigin: `${originX}px ${originY}px`,
                    }}
                >
                    <Arrow
                        width={arrowWidth}
                        height={arrowHeight}
                        tipRadius={arrowRadius}
                        strokeWidth={borderWidth}
                        style={{
                            position: 'absolute',
                            top: arrowY,
                            left: arrowX,
                            transform: placement === 'below' ? 'rotate(180deg)' : '',
                        }}
                    />
                    {render()}
                </div>
            </div>
        </Portal>
    )
}
