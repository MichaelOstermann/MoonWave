import { sidepanelWidth } from '@app/config/sizes'
import { clamp } from '@app/utils/data/clamp'
import { pipe } from '@app/utils/data/pipe'
import { computed } from '@monstermann/signals'
import { $config } from '../app/config'

export const $sidepanelWidth = computed(() => pipe(
    $config(),
    c => c.sidepanelWidth ?? sidepanelWidth.default,
    w => clamp(w, sidepanelWidth.min, sidepanelWidth.max),
    w => Math.round(w),
))
