import type { PlaylistIcon } from '@app/types'
import { iconData, icons } from '@app/config/icons'
import { Tooltip } from '@app/utils/modals/components/Tooltip'
import { useResizeObserver } from '@react-hookz/web'
import fuzzysort from 'fuzzysort'
import { LucideSearch, LucideX } from 'lucide-react'
import { createElement, type ReactNode, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { VList } from 'virtua'
import { Input } from './Core/Input/Input'
import { InputLeft } from './Core/Input/InputLeft'
import { InputRight } from './Core/Input/InputRight'
import { InputRoot } from './Core/Input/InputRoot'
import { useInput } from './Core/Input/useInput'

const baseIcons: PlaylistIcon[] = iconData
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(icon => ({ type: 'LUCIDE', value: icon.name }))

const preparedIcons = iconData.map(icon => ({
    name: icon.name,
    haystack: [icon.name, ...icon.tags].map(str => fuzzysort.prepare(str)),
}))

interface IconsProps {
    rowCount: number
    paddingX: number
    heightModifier?: number
    paddingBottom?: number
    cellSize?: number
    className?: string
    activeIcon: PlaylistIcon | undefined
    onSelectIcon?: (name: PlaylistIcon) => void
}

export function Icons({
    rowCount,
    paddingX,
    paddingBottom,
    heightModifier = 0,
    cellSize = 32,
    className,
    activeIcon,
    onSelectIcon,
}: IconsProps): ReactNode {
    const ref = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState('')
    const [width, setWidth] = useState(0)

    useResizeObserver(ref as any, (entry) => {
        setWidth(entry.contentRect.width)
    })

    const icons = value
        ? searchIcons(value)
        : baseIcons

    const input = useInput({
        value,
        placeholder: 'Search',
        onEscape: () => setValue(''),
        onUpdate: setValue,
    })

    const availableWidth = width - paddingX * 2
    const colCount = Math.floor(availableWidth / cellSize)
    const colWidth = availableWidth / colCount
    const scrollHeight = (rowCount * cellSize) + heightModifier

    const rows = icons.reduce((acc, name) => {
        const prev = acc.at(-1)
        if (prev && prev.length < colCount) {
            prev.push(name)
            return acc
        }
        acc.push([name])
        return acc
    }, [] as PlaylistIcon[][])

    return (
        <div
            ref={ref}
            className={twMerge('flex shrink grow flex-col', className)}
            style={{
                '--px': `${paddingX}px`,
                '--col-width': `${colWidth}px`,
                '--cell-size': `${cellSize}px`,
            }}
        >
            <div className="flex px-[--px]">
                <InputRoot input={input} className="h-8">
                    <InputLeft className="size-8">
                        <LucideSearch className="size-4" />
                    </InputLeft>
                    <Input className="px-8" />
                    <InputRight
                        className="size-8"
                        onClick={() => setValue('')}
                        show={value !== ''}
                    >
                        <LucideX className="size-4" />
                    </InputRight>
                </InputRoot>
            </div>
            <VList
                overscan={10}
                className="flex flex-col px-[--px]"
                style={{ height: scrollHeight }}
            >
                {rows.length === 0 && (
                    <div className="flex h-[--cell-size] items-center justify-center text-sm">
                        No results found.
                    </div>
                )}
                {rows.map((icons, idx) => {
                    return (
                        <div
                            key={idx}
                            className="flex shrink-0"
                        >
                            {icons.map(icon => (
                                <Icon
                                    key={icon.value}
                                    value={icon}
                                    activeIcon={activeIcon}
                                    onSelectIcon={onSelectIcon}
                                />
                            ))}
                        </div>
                    )
                })}
                <div style={{ height: paddingBottom }} />
            </VList>
        </div>
    )
}

interface IconProps {
    value: PlaylistIcon
    activeIcon: PlaylistIcon | undefined
    onSelectIcon?: (name: PlaylistIcon) => void
}

function Icon({
    value,
    activeIcon,
    onSelectIcon,
}: IconProps): ReactNode {
    const isActive = value.type === activeIcon?.type && value.value === activeIcon.value
    const icon = icons[value.value] ?? null

    return (
        <Tooltip
            onClick={() => onSelectIcon?.(value)}
            content={formatIconName(value.value)}
            className="w-[--col-width] justify-center"
        >
            <div
                data-active={isActive}
                className="easing-glide flex size-[--cell-size] items-center justify-center rounded transition duration-300 active:scale-[0.8] data-[active=true]:bg-[--bg-accent] data-[active=true]:text-[--fg-accent]"
            >
                {createElement(icon, { className: 'size-4' })}
            </div>
        </Tooltip>
    )
}

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

function formatIconName(name: string): string {
    return name
        .replace(/-\d+$/, '')
        .split('-')
        .map(v => v.slice(0, 1).toUpperCase() + v.slice(1))
        .join(' ')
}
