import type { ReactNode } from 'react'
import { Scroll } from '@app/components/Core/Scroll'
import { Theme } from './Theme'
import { Waveform } from './Waveform'

export function Settings(): ReactNode {
    return (
        <Scroll>
            <Waveform />
            <Theme />
        </Scroll>
    )
}
