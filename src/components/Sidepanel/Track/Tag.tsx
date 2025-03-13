import { resetTag } from '@app/actions/tags/resetTag'
import { setTag } from '@app/actions/tags/setTag'
import { Input } from '@app/components/Core/Input/Input'
import { InputLeft } from '@app/components/Core/Input/InputLeft'
import { InputRight } from '@app/components/Core/Input/InputRight'
import { InputRoot } from '@app/components/Core/Input/InputRoot'
import { useInput } from '@app/components/Core/Input/useInput'
import { $isSyncing } from '@app/state/app/isSyncing'
import { $editedTags } from '@app/state/sidepanel/editedTags'
import { $hasEditableTags } from '@app/state/sidepanel/hasEditableTags'
import { $isSavingTags } from '@app/state/sidepanel/isSavingTags'
import { $showSavingTagsDone } from '@app/state/sidepanel/showSavingTagsDone'
import { $trackTags, type TrackTags } from '@app/state/sidepanel/trackTags'
import { toU32 } from '@app/utils/toU32'
import { useSignal } from '@monstermann/signals'
import { LucideCalendar, LucideDisc3, LucideHash, type LucideIcon, LucideMusic, LucideUndo2, LucideUserRound } from 'lucide-react'
import { createElement, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const titles = {
    title: 'Title',
    artist: 'Artist',
    album: 'Album',
    year: 'Year',
    trackNr: 'Track №',
    diskNr: 'Disk №',
} satisfies Record<keyof TrackTags, string>

const icons = {
    title: LucideMusic,
    artist: LucideUserRound,
    album: LucideDisc3,
    year: LucideCalendar,
    trackNr: LucideHash,
    diskNr: LucideHash,
} satisfies Record<keyof TrackTags, LucideIcon>

export function Tag({ name, className }: {
    name: keyof TrackTags
    className?: string
}): ReactNode {
    const value = useSignal(() => $editedTags()[name])
    const current = useSignal(() => $trackTags()[name])
    const hasEditableTags = useSignal($hasEditableTags)
    const isSyncing = useSignal($isSyncing)
    const isSavingTags = useSignal($isSavingTags)
    const didFinishSavingTags = useSignal($showSavingTagsDone)

    const input = useInput({
        value,
        disabled: !hasEditableTags || isSavingTags || isSyncing,
        placeholder: 'None',
        onEscape: () => resetTag({ name }),
        onUpdate: (value) => {
            if (!isValidValue(name, value)) return
            setTag({ name, value })
        },
    })

    return (
        <div className={twMerge('flex flex-col', className)}>
            <div className="flex text-xs font-medium text-[--fg-soft]">
                {titles[name]}
            </div>
            <InputRoot input={input} className="h-8">
                <InputLeft className="size-8">
                    {createElement(icons[name], { className: 'size-4' })}
                </InputLeft>
                <Input className="px-8" />
                <InputRight
                    className="size-8"
                    show={current !== value && !didFinishSavingTags}
                    onClick={() => resetTag({ name })}
                >
                    <LucideUndo2 className="size-4" />
                </InputRight>
            </InputRoot>
        </div>
    )
}

function isValidValue(name: keyof TrackTags, value: string): boolean {
    if (value === '') return true
    if (!['year', 'diskNr', 'trackNr'].includes(name)) return true
    return String(toU32(value)) === value
}
