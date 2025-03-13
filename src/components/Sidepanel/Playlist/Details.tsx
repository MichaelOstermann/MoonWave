import type { LucideIcon } from 'lucide-react'
import { $playlistDetails, type PlaylistDetails } from '@app/state/sidepanel/playlistDetails'
import { useSignal } from '@monstermann/signals'
import { LucideClock, LucideHardDrive, LucideHash, LucideInfo } from 'lucide-react'
import { createElement, Fragment, type ReactNode } from 'react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

const titles = {
    count: 'Tracks',
    size: 'Size',
    duration: 'Duration',
} satisfies Record<keyof PlaylistDetails, string>

const icons = {
    count: LucideHash,
    size: LucideHardDrive,
    duration: LucideClock,
} satisfies Record<keyof PlaylistDetails, LucideIcon>

const order: (keyof PlaylistDetails)[] = ['count', 'size', 'duration']

export function Details(): ReactNode {
    const details = useSignal($playlistDetails)

    return (
        <Section>
            <SectionHeader
                title="Details"
                icon={LucideInfo}
            />
            <SectionBody className="py-3">
                <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-2">
                    {order.map((name) => {
                        const value = details[name]
                        return (
                            <Fragment key={name}>
                                <div className="flex h-8 items-center gap-x-2 text-xs font-medium text-[--fg-soft]">
                                    {createElement(icons[name], { className: 'size-4' })}
                                    {titles[name]}
                                </div>
                                <Detail value={value} />
                            </Fragment>
                        )
                    })}
                </div>
            </SectionBody>
        </Section>
    )
}

function Detail({ value }: { value: string }): ReactNode {
    if (value === '') return <Placeholder value="None" />
    if (value === 'Various') return <Placeholder value={value} />
    return <Value value={value} />
}

function Placeholder({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-8 items-center justify-end text-sm text-[--fg-soft]">
            {value}
        </div>
    )
}

function Value({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-8 select-text items-center justify-end text-sm">
            {value}
        </div>
    )
}
