import { sidepanelWidth } from '@app/config/sizes'
import { $config } from '@app/state/app/config'
import { clamp } from '@app/utils/data/clamp'
import { merge } from '@app/utils/data/merge'
import { pipe } from '@app/utils/data/pipe'
import { action } from '@monstermann/signals'

export const onResizeSidepanel = action((width: number) => {
    pipe(
        width,
        w => clamp(w, sidepanelWidth.min, sidepanelWidth.max),
        w => Math.round(w),
        w => $config.map(merge({ sidepanelWidth: w })),
    )
})
