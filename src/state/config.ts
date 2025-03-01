import type { Config } from '@app/types'
import { signal } from '@app/utils/signals/signal'

export const $config = signal<Config>({})
