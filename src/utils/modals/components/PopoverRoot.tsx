import type { ComponentProps, ReactNode } from 'react'
import type { Popover } from '../types'
import { glide } from '@app/config/easings'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@app/utils/signals/useSignal'
import { Portal } from '@radix-ui/react-portal'
import { twMerge } from 'tailwind-merge'
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
    const hasMeasurements = useSignal(popover.hasMeasurements)
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
        easing: glide,
        openDuration: 500,
        closeDuration: 300,
        openClassName: 'scale-100 opacity-100',
        closeClassName: 'scale-90 opacity-0',
        onChange: popover.status.set,
    })

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                ref={el => void popover.floatingElement.set(el)}
                data-modal="popover"
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
                            'relative flex rounded-lg border-[--border] bg-[--bg] text-[--fg] shadow-2xl',
                            transition.className,
                            className,
                        )}
                        style={{
                            ...transition.style,
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
                )}
            </div>
        </Portal>
    )
}
