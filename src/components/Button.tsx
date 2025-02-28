import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Pressed } from './Pressed'

export function Button({
    className,
    ...rest
}: ComponentProps<'button'>): ReactNode {
    return (
        <Pressed asChild>
            <button
                {...rest}
                type="button"
                className={twMerge(
                    'flex size-8 cursor-default items-center justify-center rounded-md text-[--fg] hover:bg-[--bg-hover] disabled:bg-transparent disabled:text-[--fg-soft]',
                    className,
                )}
            />
        </Pressed>
    )
}
