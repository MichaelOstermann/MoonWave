import type { PlaylistIcon } from '@app/types'
import type { ComponentProps, ReactNode } from 'react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { twMerge } from 'tailwind-merge'
import { AudioWaveIcon } from '../AudioWaveIcon.tsx'

interface LibraryItemIconProps extends ComponentProps<'div'> {
    wave: boolean
    icon: PlaylistIcon | undefined
}

export function LibraryItemIcon({
    wave,
    icon,
    className,
    ...rest
}: LibraryItemIconProps): ReactNode {
    const child = wave
        ? <AudioWaveIcon className="size-4" />
        : <DynamicIcon className="size-4" name={icon?.value ?? 'list-music'} />

    return (
        <div
            {...rest}
            className={twMerge(
                'flex size-[22px] shrink-0 items-center justify-center rounded',
                'group-data-[color=true]:group-data-[selected=false]:bg-[--bg-active]',
                'group-data-[color=true]:text-[--fg-active]',
                'group-data-[border=true]:text-[--fg-active]',
                'group-data-[active=true]:text-[--fg-active]',
                'group-data-[playing=true]:text-[--fg-active]',
                className,
            )}
        >
            {child}
        </div>
    )
}
