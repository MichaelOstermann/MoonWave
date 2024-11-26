import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function Button({
    className,
    ...rest
}: ComponentProps<'button'>): ReactNode {
    return (
        <button
            {...rest}
            type="button"
            className={twMerge(
                'flex size-7 cursor-default items-center justify-center rounded-md text-[--btn-fg] transition-transform hover:bg-[--btn-hover-bg] active:scale-[0.85] disabled:bg-transparent disabled:text-[--btn-disabled-fg]',
                className,
            )}
        />
    )
}
