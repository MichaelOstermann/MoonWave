import type { PlaylistIcon } from "#src/features/Playlists"
import type { ReactNode } from "react"
import { iconData, icons } from "#config/icons"
import { Array, pipe, withMutations } from "@monstermann/fn"
import fuzzysort from "fuzzysort"
import { LucideSearch, LucideX } from "lucide-react"
import { createElement, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Input, useInput } from "./Core/Input"
import { List } from "./Core/List"

const baseIcons: PlaylistIcon[] = iconData
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(icon => ({ type: "LUCIDE", value: icon.name }))

const preparedIcons = iconData.map(icon => ({
    haystack: [icon.name, ...icon.tags].map(str => fuzzysort.prepare(str)),
    name: icon.name,
}))

interface IconsProps {
    activeIcon: PlaylistIcon | undefined
    cellSize?: number
    className?: string
    colCount: number
    heightModifier?: number
    paddingBottom?: number
    paddingX: number
    rowCount: number
    onSelectIcon?: (name: PlaylistIcon) => void
}

export function Icons({
    activeIcon,
    cellSize = 32,
    className,
    colCount = 13,
    heightModifier = 0,
    onSelectIcon,
    paddingBottom,
    paddingX,
    rowCount,
}: IconsProps): ReactNode {
    const [value, setValue] = useState("")
    const scrollHeight = (rowCount * cellSize) + heightModifier

    const icons = value
        ? searchIcons(value)
        : baseIcons

    const input = useInput({
        onUpdate: setValue,
        placeholder: "Search",
        value,
        onEscape: () => setValue(""),
    })

    const rows = useMemo(() => icons.reduce((acc, name) => {
        const prev = acc.at(-1)
        if (prev && prev.length < colCount) {
            prev.push(name)
            return acc
        }
        acc.push([name])
        return acc
    }, [] as PlaylistIcon[][]), [icons, colCount])

    return (
        <div
            className={twMerge("flex shrink grow flex-col", className)}
            style={{
                "--cell-size": `${cellSize}px`,
                "--px": `${paddingX}px`,
            }}
        >
            <div className="flex px-(--px)">
                <Input.Root className="h-8" input={input}>
                    <Input.Left className="size-8">
                        <LucideSearch className="size-4" />
                    </Input.Left>
                    <Input.Field className="px-8" />
                    <Input.Right
                        className="size-8"
                        onClick={() => setValue("")}
                        show={value !== ""}
                    >
                        <LucideX className="size-4" />
                    </Input.Right>
                </Input.Root>
            </div>
            {rows.length === 0 && (
                <div
                    className="flex items-center justify-center text-sm"
                    style={{ height: scrollHeight, paddingBottom }}
                >
                    No results found.
                </div>
            )}
            {rows.length > 0 && (
                <List
                    className="px-(--px)"
                    height={32}
                    items={rows}
                    overscan={10}
                    style={{ height: scrollHeight, paddingBottom }}
                    render={function ({ item }) {
                        return (
                            <div className="flex w-full shrink-0">
                                {item.map(icon => (
                                    <Icon
                                        activeIcon={activeIcon}
                                        key={icon.value}
                                        onSelectIcon={onSelectIcon}
                                        value={icon}
                                    />
                                ))}
                            </div>
                        )
                    }}
                />
            )}
        </div>
    )
}

interface IconProps {
    activeIcon: PlaylistIcon | undefined
    value: PlaylistIcon
    onSelectIcon?: (name: PlaylistIcon) => void
}

function Icon({
    activeIcon,
    onSelectIcon,
    value,
}: IconProps): ReactNode {
    const isActive = value.type === activeIcon?.type && value.value === activeIcon.value
    const icon = icons[value.value] ?? null

    return (
        <div
            className="flex w-(--col-width) justify-center"
            onClick={() => onSelectIcon?.(value)}
        >
            <div
                className="flex size-(--cell-size) items-center justify-center rounded-sm transition duration-150 ease-in-out active:scale-[0.8] data-[active=true]:bg-(--bg-accent) data-[active=true]:text-(--fg-accent)"
                data-active={isActive}
            >
                {createElement(icon, { className: "size-4" })}
            </div>
        </div>
    )
}

function searchIcons(filter: string): PlaylistIcon[] {
    return withMutations(() => {
        return pipe(
            preparedIcons,
            Array.mapEach(icon => ({
                name: icon.name,
                score: icon.haystack.reduce((acc, prep) => {
                    return Math.max(acc, fuzzysort.single(filter, prep)?.score ?? 0)
                }, 0),
            })),
            Array.filter(icon => icon.score > 0),
            Array.sort((a, b) => b.score - a.score),
            Array.mapEach(icon => ({ type: "LUCIDE", value: icon.name })),
        )
    })
}
