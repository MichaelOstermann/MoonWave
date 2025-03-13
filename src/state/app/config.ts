import type { Config } from '@app/types'
import { signal } from '@monstermann/signals'

export const $config = signal<Config>({})
