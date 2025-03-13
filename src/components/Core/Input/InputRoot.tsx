import type { ComponentProps, ReactNode } from 'react'
import type { UseInput } from './useInput'
import { twMerge } from 'tailwind-merge'
import { InputContext } from './contexts'

interface InputRootProps extends ComponentProps<'div'> {
    input: UseInput
}

export function InputRoot({
    input,
    className,
    ...rest
}: InputRootProps): ReactNode {
    return (
        <InputContext value={input}>
            <div
                {...rest}
                className={twMerge(
                    'group relative flex shrink grow rounded-md bg-[--bg-soft] focus-within:bg-transparent focus-within:shadow-[0_0_0_2px_var(--accent)]',
                    className,
                )}
            />
        </InputContext>
    )
}
