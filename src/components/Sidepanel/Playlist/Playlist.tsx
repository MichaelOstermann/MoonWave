import type { ReactNode } from 'react'
import { Scroll } from '@app/components/Core/Scroll'
import { Color } from './Color'
import { Details } from './Details'
import { Icon } from './Icon'

export function Playlist(): ReactNode {
    return (
        <Scroll>
            <Details />
            <Color />
            <Icon />
        </Scroll>
    )
}
