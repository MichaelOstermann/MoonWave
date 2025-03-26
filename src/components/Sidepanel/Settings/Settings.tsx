import type { ReactNode } from 'react'
import { Sections } from '../Sections'
import { Theme } from './Theme'
import { Waveform } from './Waveform'

export function Settings(): ReactNode {
    return (
        <Sections>
            <Waveform />
            <Theme />
        </Sections>
    )
}
