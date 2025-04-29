import type { TrackDetails } from "#features/Sidepanel"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Sidepanel } from "#features/Sidepanel"
import { LucideAudioWaveform, LucideCalendar, LucideClock, LucideFolder, LucideHardDrive, LucideHash, LucideInfo } from "lucide-react"
import { createElement, Fragment } from "react"
import { Section } from "../Section"
import { SectionBody } from "../SectionBody"
import { SectionHeader } from "../SectionHeader"

const titles = {
    addedAt: "Added at",
    bitrate: "Bitrate",
    count: "Tracks",
    duration: "Duration",
    path: "Path",
    sampleRate: "Sample rate",
    size: "Size",
} satisfies Record<keyof TrackDetails, string>

const icons = {
    addedAt: LucideCalendar,
    bitrate: LucideAudioWaveform,
    count: LucideHash,
    duration: LucideClock,
    path: LucideFolder,
    sampleRate: LucideAudioWaveform,
    size: LucideHardDrive,
} satisfies Record<keyof TrackDetails, LucideIcon>

const order: (keyof TrackDetails)[] = [
    "count",
    "size",
    "addedAt",
    "duration",
    "sampleRate",
    "bitrate",
    "path",
]

export function DetailsView(): ReactNode {
    const details = Sidepanel.$trackDetails()

    return (
        <Section>
            <SectionHeader
                icon={LucideInfo}
                title="Details"
            />
            <SectionBody>
                <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
                    {order.map((name) => {
                        const value = details[name]
                        return (
                            <Fragment key={name}>
                                <div className="flex h-4 items-center gap-x-2 text-xs font-medium text-(--fg-soft)">
                                    {createElement(icons[name], { className: "size-4" })}
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
    if (value === "") return <Placeholder value="None" />
    if (value === "Various") return <Placeholder value={value} />
    if (name === "path") return <Path value={value} />
    return <Value value={value} />
}

function Placeholder({ value }: { value: ReactNode }): ReactNode {
    return (
        <div className="flex h-4 items-center justify-end text-sm text-(--fg-soft)">
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
