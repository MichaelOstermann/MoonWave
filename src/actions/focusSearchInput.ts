import { action } from '@app/utils/signals/action'

export const focusSearchInput = action(() => {
    const input = document.querySelector('.sidebar-search-input') as HTMLInputElement | undefined
    input?.focus()
})
