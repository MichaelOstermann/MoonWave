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
                'easing-glide flex size-8 cursor-default items-center justify-center rounded-md text-[--fg] transition-transform duration-300 hover:bg-[--bg-hover] active:scale-[0.8] disabled:bg-transparent disabled:text-[--fg-soft]',
                className,
            )}
        />
    )
}
