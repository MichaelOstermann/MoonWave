import type { ComponentProps, ReactNode } from 'react'
import type { Dialog } from '../types'
import { useTransition } from '@app/hooks/useTransition'
import { useSignal } from '@monstermann/signals'
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
        openDuration: 250,
        closeDuration: 200,
        onChange: dialog.status.set,
    })

    return (
        <div
            style={transition.style({
                open: { opacity: 1 },
                close: { opacity: 0 },
            })}
            className={twJoin(
                'modal dialog absolute inset-0 flex items-center justify-center bg-[--overlay]',
                transition.status,
            )}
        >
            <div
                ref={dialog.floatingElement.set}
                style={{
                    ...transition.style({
                        open: { transform: 'scale(1)' },
                        close: { transform: 'scale(0.95)' },
                    }),
                    ...style,
                }}
                className={twMerge(
                    'floating flex rounded-lg border border-[--border] bg-[--bg] text-sm text-[--fg]',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
