import type { EditableTags } from "#features/Tags"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { resetTag } from "#actions/tags/resetTag"
import { setTag } from "#actions/tags/setTag"
import { Input, useInput } from "#components/Core/Input"
import { Library } from "#features/Library"
import { Tags } from "#features/Tags"
import { is, Number, pipe, String } from "@monstermann/fn"
import { LucideCalendar, LucideDisc3, LucideHash, LucideMusic, LucideUndo2, LucideUserRound } from "lucide-react"
import { createElement } from "react"
import { twMerge } from "tailwind-merge"

const titles = {
    album: "Album",
    artist: "Artist",
    diskNr: "Disk №",
    title: "Title",
    trackNr: "Track №",
    year: "Year",
} satisfies Record<keyof EditableTags, string>

const icons = {
    album: LucideDisc3,
    artist: LucideUserRound,
    diskNr: LucideHash,
    title: LucideMusic,
    trackNr: LucideHash,
    year: LucideCalendar,
} satisfies Record<keyof EditableTags, LucideIcon>

export function TagView({ className, name }: {
    className?: string
    name: keyof EditableTags
}): ReactNode {
    const value = Tags.$edited()[name]
    const current = Tags.$tracks()[name]
    const hasEditableTags = Tags.$hasEditable()
    const isSyncing = Library.$isSyncing()
    const isSavingTags = Tags.$isSaving()
    const didFinishSavingTags = Tags.$showSavingDone()

    const input = useInput({
        disabled: !hasEditableTags || isSavingTags || isSyncing,
        placeholder: "None",
        value,
        onEscape: () => resetTag({ name }),
        onUpdate: (value) => {
            if (!isValidValue(name, value)) return
            setTag({ name, value })
        },
    })

    return (
        <div className={twMerge("flex flex-col", className)}>
            <div className="flex text-xs font-medium text-(--fg-soft)">
                {titles[name]}
            </div>
            <Input.Root className="h-8" input={input}>
                <Input.Left className="size-8">
                    {createElement(icons[name], { className: "size-4" })}
                </Input.Left>
                <Input.Field className="px-8" />
                <Input.Right
                    className="size-8"
                    onClick={() => resetTag({ name })}
                    show={current !== value && !didFinishSavingTags}
                >
                    <LucideUndo2 className="size-4" />
                </Input.Right>
            </Input.Root>
        </div>
    )
}

function isValidValue(name: keyof EditableTags, value: string): boolean {
    if (value === "") return true
    if (!["year", "diskNr", "trackNr"].includes(name)) return true
    return pipe(
        value,
        String.parseInt,
        Number.toString,
        is(value),
    )
}
