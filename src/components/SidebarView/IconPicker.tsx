import type { PlaylistColor, PlaylistIcon } from "#src/features/Playlists"
import type { ReactNode } from "react"
import { IconColors } from "../IconColors"
import { Icons } from "../Icons"

interface IconPickerProps {
    activeColor: PlaylistColor | undefined
    activeIcon: PlaylistIcon | undefined
    onSelectColor: (name: PlaylistColor | undefined) => void
    onSelectIcon: (name: PlaylistIcon) => void
}

export function IconPicker({
    activeColor,
    activeIcon,
    onSelectColor,
    onSelectIcon,
}: IconPickerProps): ReactNode {
    return (
        <div
            className="flex flex-col gap-y-3"
            style={{
                "--bg-accent": activeColor ? `var(--bg-${activeColor.value})` : undefined,
                "--fg-accent": activeColor ? `var(--fg-${activeColor.value})` : undefined,
                "width": 440,
            }}
        >
            <IconColors
                activeColor={activeColor}
                className="mt-3 px-3"
                onSelectColor={onSelectColor}
            />
            <Icons
                activeIcon={activeIcon}
                className="gap-y-3"
                colCount={13}
                heightModifier={8}
                onSelectIcon={onSelectIcon}
                paddingBottom={10}
                paddingX={10}
                rowCount={12}
            />
        </div>
    )
}
