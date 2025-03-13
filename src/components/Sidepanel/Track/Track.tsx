import type { ReactNode } from 'react'
import { Scroll } from '@app/components/Core/Scroll'
import { Details } from './Details'
import { Tags } from './Tags'

export function Track(): ReactNode {
    return (
        <Scroll>
            <Tags />
            <Details />
        </Scroll>
    )
}
