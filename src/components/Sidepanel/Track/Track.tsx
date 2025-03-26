import type { ReactNode } from 'react'
import { Sections } from '../Sections'
import { Details } from './Details'
import { Tags } from './Tags'

export function Track(): ReactNode {
    return (
        <Sections>
            <Tags />
            <Details />
        </Sections>
    )
}
