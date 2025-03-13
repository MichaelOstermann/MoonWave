import { sidebarWidth } from '@app/config/sizes'
import { clamp } from '@app/utils/data/clamp'
import { pipe } from '@app/utils/data/pipe'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $sidebarWidth = computed(() => pipe(
    $config(),
    c => c.sidebarWidth ?? sidebarWidth.default,
    w => clamp(w, sidebarWidth.min, sidebarWidth.max),
    w => Math.round(w),
))
