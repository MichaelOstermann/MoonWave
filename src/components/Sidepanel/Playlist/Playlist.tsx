import type { ReactNode } from 'react'
import { Sections } from '../Sections'
import { Color } from './Color'
import { Details } from './Details'
import { Icon } from './Icon'

export function Playlist(): ReactNode {
    return (
        <Sections>
            <Color />
            <Icon />
            <Details />
        </Sections>
    )
}
