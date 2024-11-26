import type { LSMState } from '../types'
import { isSelected } from './isSelected'
import { select } from './select'
import { unselect } from './unselect'

export function toggleSelect<T>(state: LSMState<T>, selectable: T): LSMState<T> {
    return isSelected(state, selectable)
        ? unselect(state, selectable)
        : select(state, selectable)
}
