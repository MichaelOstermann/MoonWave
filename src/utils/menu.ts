import type { MouseEvent } from 'react'
import { Menu, type MenuOptions } from '@tauri-apps/api/menu'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useState } from 'react'

export type MenuItem = Exclude<MenuOptions['items'], undefined>[number] | undefined

function isSeparator(menuItem: MenuItem): menuItem is { item: 'Separator' } {
    if (!menuItem) return false
    if (!('item' in menuItem)) return false
    return menuItem.item === 'Separator'
}

export async function showMenu(
    items: (MenuItem | (() => MenuItem))[],
    options?: { onOpen: () => void, onClose: () => void },
): Promise<void> {
    const finalizedItems = items
        .map((item) => {
            if (!item) return undefined
            if (typeof item === 'function') return item()
            return item
        })
        .filter(item => !!item)
        .filter((item, idx, items) => {
            if (!isSeparator(item)) return true
            if (idx === 0) return false
            if (idx === items.length - 1) return false
            return !isSeparator(items[idx - 1])
        })

    options?.onOpen()
    const menu = await Menu.new({ items: finalizedItems })
    await menu.popup()
    options?.onClose()
}

export function useMenu(getItems: (MenuItem | (() => MenuItem))[]): {
    isOpen: boolean
    show: (evt?: MouseEvent) => Promise<void>
} {
    const [isOpen, setIsOpen] = useState(false)

    return {
        isOpen,
        show: (evt) => {
            if (evt) evt.stopPropagation()
            if (evt) evt.preventDefault()
            getCurrentWindow().setFocus()
            return showMenu(getItems, {
                onOpen: () => setIsOpen(true),
                onClose: () => setIsOpen(false),
            })
        },
    }
}
