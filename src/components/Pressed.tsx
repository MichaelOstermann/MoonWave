import type { ComponentProps, ReactNode } from 'react'
import { glide } from '@app/config/easings'
import { Slot } from '@radix-ui/react-slot'
import { twMerge } from 'tailwind-merge'

interface PressedProps extends ComponentProps<'div'> {
    asChild?: boolean
}

export function Pressed({ asChild, className, style, ...rest }: PressedProps): ReactNode {
    const Comp = asChild ? Slot : 'div'

    return (
        <Comp
            {...rest}
            style={{ transitionTimingFunction: glide, ...style }}
            className={twMerge('transition-transform duration-300 active:scale-[0.8]', className)}
        />
    )
}
