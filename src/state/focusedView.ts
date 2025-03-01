import type { FocusedView } from '@app/types'
import { signal } from '@app/utils/signals/signal'

export const $focusedView = signal<FocusedView>('SIDEBAR')
