import type { PlaylistIcon } from '@app/types'
import type { ReactNode } from 'react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { AudioWaveIcon } from '../AudioWaveIcon.tsx'

interface PlaylistItemIconProps {
    wave?: boolean
    icon: PlaylistIcon | undefined
}

export function PlaylistItemIcon({
    wave,
    icon,
}: PlaylistItemIconProps): ReactNode {
    if (wave) {
        return (
            <AudioWaveIcon
                className="size-4 shrink-0"
            />
        )
    }

    return (
        <DynamicIcon
            name={icon?.value ?? 'list-music'}
            className="size-4 shrink-0"
        />
    )
}
