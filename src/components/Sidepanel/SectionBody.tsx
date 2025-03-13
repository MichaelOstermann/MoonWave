import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionBodyProps extends ComponentProps<'div'> {
    disabled?: boolean
}

export function SectionBody({
    className,
    disabled,
    ...rest
}: SectionBodyProps): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                'flex px-3 py-5',
                disabled && 'pointer-events-none opacity-50',
                className,
            )}
        />
    )
}
