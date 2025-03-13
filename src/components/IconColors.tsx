import type { PlaylistColor } from '@app/types'
import type { ComponentProps, ReactNode } from 'react'
import { colors } from '@app/config/colors'
import { twMerge } from 'tailwind-merge'

interface IconColorsProps extends ComponentProps<'div'> {
    activeColor: PlaylistColor | undefined
    onSelectColor: (color: PlaylistColor | undefined) => void
}

export function IconColors({
    activeColor,
    onSelectColor,
    className,
}: IconColorsProps): ReactNode {
    return (
        <div
            className={twMerge(
                'grid shrink grow grid-cols-[repeat(auto-fit,minmax(24px,1fr))] gap-2',
                className,
            )}
        >
            <IconColor
                value={undefined}
                isActive={activeColor === undefined}
                onClick={() => onSelectColor?.(undefined)}
            />
            {colors.map(color => (
                <IconColor
                    key={color}
                    value={{ type: 'PRESET', value: color }}
                    isActive={activeColor?.type === 'PRESET' && activeColor.value === color}
                    onClick={() => onSelectColor?.({ type: 'PRESET', value: color })}
                />
            ))}
        </div>
    )
}

interface IconColorProps extends ComponentProps<'div'> {
    value: PlaylistColor | undefined
    isActive: boolean
}

function IconColor({
    value,
    isActive,
    ...rest
}: IconColorProps): ReactNode {
    return (
        <div {...rest}>
            <div
                className="easing-glide relative flex size-6 items-center justify-center rounded-full bg-[--outer] transition-transform duration-300 active:scale-[0.8]"
                style={{
                    '--inner': value ? `var(--fg-${value.value})` : 'var(--fg)',
                    '--outer': value ? `var(--bg-${value.value})` : 'var(--bg-hover)',
                }}
            >
                <div
                    data-active={isActive}
                    className="easing-glide absolute size-full scale-[0.3] rounded-full bg-[--inner] transition-transform duration-300 data-[active=true]:scale-100"
                />
            </div>
        </div>
    )
}
