import type { PlaylistColor, PlaylistIcon } from '@app/types'
import type { ComponentProps, ReactNode } from 'react'
import { colors } from '@app/config/colors'
import { glide } from '@app/config/easings'
import { icons } from '@app/config/icons'
import { clamp } from '@app/utils/data/clamp'
import { Tooltip } from '@app/utils/modals/components/Tooltip'
import { useTooltip } from '@app/utils/modals/useTooltip'
import fuzzysort from 'fuzzysort'
import { LucideSearch, LucideX } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { VList } from 'virtua'
import { Pressed } from '../Pressed'

interface IconPickerProps {
    side: 'above' | 'below'
    activeIcon?: PlaylistIcon
    activeColor?: PlaylistColor
    onSelectIcon?: (name: PlaylistIcon) => void
    onSelectColor?: (name: PlaylistColor | undefined) => void
}

const colCount = 12
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
    onSelectIcon,
    activeColor,
    onSelectColor,
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

    const minHeight = (clamp(rows.length, 1, minRows) * rowHeight) + (rowHeight - iconSize) / 2
    const [initialHeight] = useState(() => minHeight)
    const height = side === 'above' ? initialHeight : minHeight

    return (
        <div
            className="flex flex-col gap-y-3 text-sm"
            style={{
                '--row-padding': `${padding}px`,
                '--row-height': `${rowHeight}px`,
                '--fg-active': activeColor ? `var(--fg-${activeColor.value})` : undefined,
                '--bg-active': activeColor ? `var(--bg-${activeColor.value})` : undefined,
            }}
        >
            <div className="flex shrink-0 items-center justify-between px-3 pt-3">
                <IconColor
                    color={undefined}
                    isActive={activeColor === undefined}
                    onClick={() => onSelectColor?.(undefined)}
                />
                {colors.map(color => (
                    <IconColor
                        key={color}
                        color={{ type: 'PRESET', value: color }}
                        isActive={activeColor?.type === 'PRESET' && activeColor.value === color}
                        onClick={() => onSelectColor?.({ type: 'PRESET', value: color })}
                    />
                ))}
            </div>
            <div className="group flex shrink-0 px-2.5">
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
                        onChange={evt => setFilter(evt.target.value)}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Escape') setFilter('')
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
                        <div key={idx} className="flex shrink-0">
                            {icons.map(icon => (
                                <Icon
                                    key={icon.value}
                                    icon={icon}
                                    activeIcon={activeIcon}
                                    onSelectIcon={() => onSelectIcon?.(icon)}
                                />
                            ))}
                        </div>
                    )
                })}
                <div style={{ height: padding }} />
            </VList>
        </div>
    )
}

interface IconColorProps extends Omit<ComponentProps<'div'>, 'color'> {
    color: PlaylistColor | undefined
    isActive: boolean
}

function IconColor({ color, isActive, ...rest }: IconColorProps): ReactNode {
    return (
        <div {...rest}>
            <Pressed
                className="relative flex size-6 items-center justify-center rounded-full bg-[--outer]"
                style={{
                    '--inner': color ? `var(--fg-${color.value})` : 'var(--fg)',
                    '--outer': color ? `var(--bg-${color.value})` : 'var(--bg-hover)',
                }}
            >
                <div
                    data-active={isActive}
                    style={{ transitionTimingFunction: glide }}
                    className="absolute size-full scale-[0.3] rounded-full bg-[--inner] transition-transform duration-300 data-[active=true]:scale-100"
                />
            </Pressed>
        </div>
    )
}

interface IconProps {
    icon: PlaylistIcon
    activeIcon?: PlaylistIcon
    onSelectIcon?: (name: PlaylistIcon) => void
}

function Icon({ icon, activeIcon, onSelectIcon }: IconProps): ReactNode {
    const isActive = icon.type === activeIcon?.type
        && icon.value === activeIcon.value

    const tooltip = useTooltip(`iconpicker-${icon.value}`)

    return (
        <Tooltip
            tooltip={tooltip}
            onClick={() => onSelectIcon?.(icon)}
            render={() => formatIconName(icon.value)}
        >
            <Pressed
                data-active={isActive}
                className="flex size-[--row-height] items-center justify-center rounded transition data-[active=true]:bg-[--bg-active] data-[active=true]:text-[--fg-active]"
            >
                <DynamicIcon
                    name={icon.value}
                    size={iconSize}
                />
            </Pressed>
        </Tooltip>
    )
}

function formatIconName(name: string): string {
    return name
        .replace(/-\d+$/, '')
        .split('-')
        .map(v => v.slice(0, 1).toUpperCase() + v.slice(1))
        .join(' ')
}
