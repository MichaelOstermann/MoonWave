import type { PlaylistColor, PlaylistIcon } from '@app/types'
import type { ReactNode } from 'react'
import { IconColors } from '../IconColors'
import { Icons } from '../Icons'

interface IconPickerProps {
    activeIcon: PlaylistIcon | undefined
    activeColor: PlaylistColor | undefined
    onSelectIcon: (name: PlaylistIcon) => void
    onSelectColor: (name: PlaylistColor | undefined) => void
}

export function IconPicker({
    activeIcon,
    onSelectIcon,
    activeColor,
    onSelectColor,
}: IconPickerProps): ReactNode {
    return (
        <div
            className="flex w-96 flex-col gap-y-3"
            style={{
                '--fg-accent': activeColor ? `var(--fg-${activeColor.value})` : undefined,
                '--bg-accent': activeColor ? `var(--bg-${activeColor.value})` : undefined,
            }}
        >
            <IconColors
                activeColor={activeColor}
                onSelectColor={onSelectColor}
                className="mt-3 px-3"
            />
            <Icons
                rowCount={8}
                paddingX={10}
                paddingBottom={10}
                heightModifier={8}
                className="gap-y-3"
                activeIcon={activeIcon}
                onSelectIcon={onSelectIcon}
            />
        </div>
    )
}
