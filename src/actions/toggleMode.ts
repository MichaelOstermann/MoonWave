import type { Mode } from '@app/types'
import { $playingMode } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { match } from 'ts-pattern'
import { setMode } from './setMode'

export const toggleMode = action(() => {
    const mode = match($playingMode.value)
        .returnType<Mode>()
        .with('SHUFFLE', () => 'REPEAT')
        .with('REPEAT', () => 'SINGLE')
        .with('SINGLE', () => 'SHUFFLE')
        .exhaustive()

    setMode(mode)
})
