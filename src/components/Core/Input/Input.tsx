import { type ComponentProps, type ReactNode, useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { InputContext } from './contexts'

interface InputProps extends ComponentProps<'input'> {}

export function Input({ className, ...rest }: InputProps): ReactNode {
    const { props } = useContext(InputContext)

    return (
        <input
            type="text"
            {...props}
            {...rest}
            className={twMerge(
                'flex shrink grow truncate border-none bg-transparent text-sm outline-none placeholder:text-[--fg-soft]',
                props.className,
                className,
            )}
        />
    )
}
