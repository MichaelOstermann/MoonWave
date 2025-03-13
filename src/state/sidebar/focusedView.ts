import type { FocusedView } from '@app/types'
import { signal } from '@monstermann/signals'

export const $focusedView = signal<FocusedView>('SIDEBAR')
