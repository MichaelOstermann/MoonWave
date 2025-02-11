import type { PlaylistIcon } from '@app/types'
import type { ReactNode } from 'react'
import { icons } from '@app/config/icons'
import fuzzysort from 'fuzzysort'
import { LucideSearch, LucideX } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { VList } from 'virtua'

interface IconPickerProps {
    side: 'above' | 'below'
    activeIcon?: PlaylistIcon
    onHoverIcon?: (name: PlaylistIcon | undefined) => void
    onSelectIcon?: (name: PlaylistIcon) => void
}

const colCount = 10
const minRows = 10
const rowHeight = 34
const iconSize = 16
const padding = (rowHeight - iconSize) / 2
const width = (colCount * rowHeight) + (padding * 2)

const baseIcons: PlaylistIcon[] = icons
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(icon => ({ type: 'LUCIDE', value: icon.name }))

const preparedIcons = icons.map(icon => ({
    name: icon.name,
    haystack: [icon.name, ...icon.tags].map(str => fuzzysort.prepare(str)),
}))

function searchIcons(filter: string): PlaylistIcon[] {
    return preparedIcons
        .map(icon => ({
            name: icon.name,
            score: icon.haystack.reduce((acc, prep) => {
                return Math.max(acc, fuzzysort.single(filter, prep)?.score ?? 0)
            }, 0),
        }))
        .filter(icon => icon.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(icon => ({ type: 'LUCIDE', value: icon.name }))
}

export function IconPicker({
    side,
    activeIcon,
    onHoverIcon,
    onSelectIcon,
}: IconPickerProps): ReactNode {
    const [filter, setFilter] = useState('')

    const icons = filter
        ? searchIcons(filter)
        : baseIcons

    const rows = icons.reduce((acc, name) => {
        const prev = acc.at(-1)
        if (prev && prev.length < colCount) {
            prev.push(name)
            return acc
        }
        acc.push([name])
        return acc
    }, [] as PlaylistIcon[][])

    const minHeight = (Math.min(rows.length, minRows) * rowHeight) + (rowHeight - iconSize) / 2
    const [initialHeight] = useState(() => minHeight)
    const height = side === 'above' ? initialHeight : minHeight

    return (
        <div
            className="flex flex-col text-sm"
            style={{
                '--row-padding': `${padding}px`,
                '--row-height': `${rowHeight}px`,
            }}
        >
            <div className="group flex shrink-0 px-2.5 py-3">
                <div className="relative flex shrink grow">
                    <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
                        <LucideSearch className="size-4" />
                    </div>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center px-2.5 group-has-[input:placeholder-shown]:hidden"
                        onClick={() => setFilter('')}
                        onPointerDown={evt => evt.preventDefault()}
                    >
                        <LucideX className="size-4" />
                    </div>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search"
                        className="sidebar-search-input h-8 w-full rounded-md bg-[--bg-soft] px-8 text-sm outline-none placeholder:text-[--fg-soft]"
                        value={filter}
                        onChange={(evt) => {
                            setFilter(evt.target.value)
                            onHoverIcon?.(undefined)
                        }}
                    />
                </div>
            </div>
            <VList
                overscan={20}
                className="flex shrink grow flex-col px-[--row-padding]"
                style={{ height, width }}
            >
                {rows.length === 0 && (
                    <div className="flex h-[--row-height] items-center justify-center">
                        No results found.
                    </div>
                )}
                {rows.map((icons, idx) => {
                    return (
                        <div
                            key={idx}
                            className="flex shrink-0"
                        >
                            {icons.map((icon) => {
                                const isActive = icon.type === activeIcon?.type
                                    && icon.value === activeIcon.value
                                return (
                                    <div
                                        key={icon.value}
                                        onPointerEnter={() => onHoverIcon?.(icon)}
                                        onPointerLeave={() => onHoverIcon?.(undefined)}
                                        onClick={() => onSelectIcon?.(icon)}
                                        className={twJoin(
                                            'flex size-[--row-height] items-center justify-center rounded',
                                            isActive && 'bg-[--bg-active] text-[--fg-active]',
                                            !isActive && 'hover:bg-[--bg-hover]',
                                        )}
                                    >
                                        <DynamicIcon
                                            name={icon.value}
                                            size={iconSize}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                <div style={{ height: padding }} />
            </VList>
        </div>
    )
}
