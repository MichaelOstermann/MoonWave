import type { ComponentProps, ReactNode } from 'react'
import type { Dialog } from '../types'
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

    const { status, isClosedOrClosing, isOpenedOrOpening } = useTransition({
        isOpen,
        openDuration: 300,
        closeDuration: 200,
        onChange: dialog.status.set,
    })

    return (
        <div
            data-modal="dialog"
            data-modal-status={status}
            className={twJoin(
                'absolute inset-0 flex items-center justify-center bg-[--overlay] transition',
                isClosedOrClosing && 'opacity-0 duration-200',
                isOpenedOrOpening && 'opacity-100 duration-300',
            )}
        >
            <div
                ref={el => void dialog.floatingElement.set(el)}
                style={style}
                className={twMerge(
                    'flex rounded-lg bg-[--bg] text-sm text-[--fg] shadow-2xl transition',
                    isClosedOrClosing && 'scale-95 duration-200',
                    isOpenedOrOpening && 'scale-100 duration-300',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
