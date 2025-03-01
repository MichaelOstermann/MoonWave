import type { Mode } from '@app/types'
import { $playingMode } from '@app/state/playingMode'
import { action } from '@app/utils/signals/action'
import { match } from 'ts-pattern'
import { setMode } from './setMode'

export const toggleMode = action(() => {
    const mode = match($playingMode())
        .returnType<Mode>()
        .with('SHUFFLE', () => 'REPEAT')
        .with('REPEAT', () => 'SINGLE')
        .with('SINGLE', () => 'SHUFFLE')
        .exhaustive()

    setMode(mode)
})
