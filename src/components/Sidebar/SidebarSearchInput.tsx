import type { ReactNode } from 'react'
import { filterLibrary } from '@app/actions/filterLibrary'
import { $tracksFilter } from '@app/state/state'
import { LucideSearch, LucideX } from 'lucide-react'

export function SidebarSearchInput(): ReactNode {
    return (
        <div
            className="group flex shrink-0 px-2.5"
            onMouseDown={evt => evt.stopPropagation()}
        >
            <div className="relative flex shrink grow">
                <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
                    <LucideSearch className="size-4" />
                </div>
                <div
                    className="absolute inset-y-0 right-0 flex items-center px-2.5 group-has-[input:placeholder-shown]:hidden"
                    onClick={() => filterLibrary('')}
                    onMouseDown={evt => evt.preventDefault()}
                >
                    <LucideX className="size-4" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="sidebar-search-input h-8 w-full rounded-md bg-[--input-bg] px-8 text-sm outline-none placeholder:text-[--input-placeholder-fg]"
                    value={$tracksFilter.value}
                    onChange={evt => filterLibrary(evt.target.value)}
                    onContextMenu={evt => evt.stopPropagation()}
                />
            </div>
        </div>
    )
}
