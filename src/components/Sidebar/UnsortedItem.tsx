import type { ReactNode } from 'react'
import { $unsortedTracksCount } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { LibraryItem } from './LibraryItem'

export function UnsortedItem(): ReactNode {
    const count = useSignal($unsortedTracksCount)

    return (
        <LibraryItem name="UNSORTED">
            {count > 0 && (
                <div className="flex h-5 items-center rounded-full bg-[--bg-selected] px-1.5 text-xxs font-semibold group-data-[active=true]:bg-[--bg-active] group-data-[active=true]:text-[--fg-active]">
                    {count}
                </div>
            )}
        </LibraryItem>
    )
}
