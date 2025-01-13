import { $showCommandMenu } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const focusSearchInput = action(() => {
    $showCommandMenu.set(false)
    const input = document.querySelector('.sidebar-search-input') as HTMLInputElement | undefined
    input?.focus()
})
