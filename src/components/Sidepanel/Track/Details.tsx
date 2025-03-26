import type { LucideIcon } from 'lucide-react'
import { $trackDetails, type TrackDetails } from '@app/state/sidepanel/trackDetails'
import { useSignal } from '@monstermann/signals'
import { LucideAudioWaveform, LucideCalendar, LucideClock, LucideFolder, LucideHardDrive, LucideHash, LucideInfo } from 'lucide-react'
import { createElement, Fragment, type ReactNode } from 'react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

const titles = {
    count: 'Tracks',
    size: 'Size',
    addedAt: 'Added at',
    duration: 'Duration',
    sampleRate: 'Sample rate',
    bitrate: 'Bitrate',
    path: 'Path',
} satisfies Record<keyof TrackDetails, string>

const icons = {
    count: LucideHash,
    size: LucideHardDrive,
    addedAt: LucideCalendar,
    duration: LucideClock,
    sampleRate: LucideAudioWaveform,
    bitrate: LucideAudioWaveform,
    path: LucideFolder,
} satisfies Record<keyof TrackDetails, LucideIcon>

const order: (keyof TrackDetails)[] = [
    'count',
    'size',
    'addedAt',
    'duration',
    'sampleRate',
    'bitrate',
    'path',
]

export function Details(): ReactNode {
    const details = useSignal($trackDetails)

    return (
        <Section>
            <SectionHeader
                title="Details"
                icon={LucideInfo}
            />
            <SectionBody>
                <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
                    {order.map((name) => {
                        const value = details[name]
                        return (
                            <Fragment key={name}>
                                <div className="flex h-4 items-center gap-x-2 text-xs font-medium text-[--fg-soft]">
                                    {createElement(icons[name], { className: 'size-4' })}
                                    {titles[name]}
                                </div>
                                <Detail
                                    name={name}
                                    value={value}
                                />
                            </Fragment>
                        )
                    })}
                </div>
            </SectionBody>
        </Section>
    )
}

function Detail({ name, value }: { name: keyof TrackDetails, value: string }): ReactNode {
    if (value === '') return <Placeholder value="None" />
    if (value === 'Various') return <Placeholder value={value} />
    if (name === 'path') return <Path value={value} />
    return <Value value={value} />
}

function Placeholder({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-4 items-center justify-end text-sm text-[--fg-soft]">
            {value}
        </div>
    )
}

function Value({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-4 select-text items-center justify-end text-sm">
            {value}
        </div>
    )
}

function Path({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-4 select-text items-center overflow-auto whitespace-nowrap text-sm">
            {value}
        </div>
    )
}
