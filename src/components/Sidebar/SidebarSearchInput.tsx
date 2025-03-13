import type { ReactNode } from 'react'
import { filterLibrary } from '@app/actions/tracks/filterLibrary'
import { $tracksFilter } from '@app/state/tracks/tracksFilter'
import { useSignal } from '@monstermann/signals'
import { LucideSearch, LucideX } from 'lucide-react'
import { Input } from '../Core/Input/Input'
import { InputLeft } from '../Core/Input/InputLeft'
import { InputRight } from '../Core/Input/InputRight'
import { InputRoot } from '../Core/Input/InputRoot'
import { useInput } from '../Core/Input/useInput'

export function SidebarSearchInput(): ReactNode {
    const value = useSignal($tracksFilter)
    const input = useInput({
        value,
        placeholder: 'Search',
        onUpdate: value => filterLibrary(value),
        onEscape: () => filterLibrary(''),
    })

    return (
        <div
            className="group flex shrink-0 px-2"
            onClick={evt => evt.stopPropagation()}
        >
            <InputRoot input={input} className="h-8">
                <InputLeft className="size-8">
                    <LucideSearch className="size-4" />
                </InputLeft>
                <Input className="sidebar-search-input px-8" />
                <InputRight
                    className="size-8"
                    show={value !== ''}
                    onClick={() => filterLibrary('')}
                >
                    <LucideX className="size-4" />
                </InputRight>
            </InputRoot>
        </div>
    )
}
