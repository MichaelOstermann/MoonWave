import { removeEntry } from '@app/utils/data/removeEntry'
import { setEntry } from '@app/utils/data/setEntry'
import { Children, type ComponentProps, type ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ButtonGroupButtonContext, ButtonGroupContext } from './contexts'

export interface ButtonGroupRootProps extends ComponentProps<'div'> {
    active: number
    onSelectActive: (active: number) => void
}

export function ButtonGroupRoot({
    children,
    active,
    onSelectActive,
    className,
    ...props
}: ButtonGroupRootProps): ReactNode {
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const [buttons, setButtons] = useState<Map<number, Element>>(new Map())

    const [hasMeasurements, setHasMeasurements] = useState(false)
    const [left, setLeft] = useState(0)
    const [width, setWidth] = useState(0)

    const reset = function () {
        setLeft(0)
        setWidth(0)
    }

    useEffect(() => {
        const button = buttons.get(active)
        if (!root || !button) {
            reset()
            return
        }
        const rootBounds = root.getBoundingClientRect()
        const buttonBounds = button.getBoundingClientRect()
        setWidth(buttonBounds.width)
        setLeft(buttonBounds.left - rootBounds.left)
        setHasMeasurements(true)
    }, [root, buttons, active])

    return (
        <ButtonGroupContext
            value={{
                active,
                onSelect: onSelectActive,
                registerElement(index, element) {
                    setButtons((buttons) => {
                        return element
                            ? setEntry(buttons, index, element)
                            : removeEntry(buttons, index)
                    })
                },
            }}
        >
            <div
                {...props}
                ref={setRoot}
                className={twMerge('relative flex h-7', className)}
            >
                {Children.map(children, (child, index) => (
                    <ButtonGroupButtonContext value={{ index }}>
                        {child}
                    </ButtonGroupButtonContext>
                ))}
                {hasMeasurements && (
                    <div
                        className="absolute inset-y-0 left-0 rounded-md bg-[--bg-blue] transition-[transform,width] duration-300 ease-in-out"
                        style={{
                            width,
                            transform: `translateX(${left}px)`,
                        }}
                    />
                )}
            </div>
        </ButtonGroupContext>
    )
}
