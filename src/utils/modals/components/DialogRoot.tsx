import type { ComponentProps, ReactNode } from 'react'
import type { Dialog } from '../types'
import { glide } from '@app/config/easings'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@app/utils/signals/useSignal'
import { twJoin, twMerge } from 'tailwind-merge'

export interface DialogRootProps extends ComponentProps<'div'> {
    dialog: Dialog
}

export function DialogRoot({
    dialog,
    style,
    className,
    children,
}: DialogRootProps): ReactNode {
    const isOpen = useSignal(dialog.isOpen)

    const transition = useTransition({
        isOpen,
        easing: glide,
        openDuration: 500,
        closeDuration: 300,
        onChange: dialog.status.set,
    })

    return (
        <div
            data-modal="dialog"
            data-modal-status={transition.status}
            style={transition.style}
            className={twJoin(
                transition.className,
                'absolute inset-0 flex items-center justify-center bg-[--overlay]',
                transition.isClosedOrClosing && 'opacity-0',
                transition.isOpenedOrOpening && 'opacity-100',
            )}
        >
            <div
                ref={el => void dialog.floatingElement.set(el)}
                style={style}
                className={twMerge(
                    transition.className,
                    'flex rounded-lg bg-[--bg] text-sm text-[--fg] shadow-2xl',
                    transition.isClosedOrClosing && 'scale-95',
                    transition.isOpenedOrOpening && 'scale-100',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
