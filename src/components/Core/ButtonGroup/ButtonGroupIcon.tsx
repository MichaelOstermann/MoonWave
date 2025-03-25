import type { ComponentProps, ReactNode } from 'react'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { ButtonGroupButtonContext, ButtonGroupContext } from './contexts.ts'

export interface ButtonGroupIconProps extends ComponentProps<'div'> {}

export function ButtonGroupIcon({ children, className, ...props }: ButtonGroupIconProps): ReactNode {
    const { index } = useContext(ButtonGroupButtonContext)
    const { active, registerElement, onSelect } = useContext(ButtonGroupContext)

    return (
        <div
            className="flex h-full"
            ref={element => registerElement(index, element)}
            onClick={() => onSelect(index)}
        >
            <div
                {...props}
                data-active={index === active}
                className={twMerge(
                    'flex aspect-square h-full items-center justify-center rounded-md transition-transform duration-300 ease-in-out active:scale-[0.8] data-[active=true]:text-[--fg-blue]',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    )
}
