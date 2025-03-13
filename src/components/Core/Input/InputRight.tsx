import { type ComponentProps, type ReactNode, useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { InputContext } from './contexts'

interface InputRightProps extends ComponentProps<'div'> {
    show?: boolean
}

export function InputRight({
    show = true,
    className,
    onPointerDown,
    ...rest
}: InputRightProps): ReactNode {
    const { props } = useContext(InputContext)

    return (
        <div
            {...rest}
            data-show={show}
            className={twMerge(
                'easing-glide absolute right-0 flex scale-0 items-center justify-center transition-transform duration-300 data-[show=true]:scale-100',
                className,
            )}
            onPointerDown={(evt) => {
                evt.preventDefault()
                if (!show || props.disabled) return
                onPointerDown?.(evt)
            }}
        />
    )
}
