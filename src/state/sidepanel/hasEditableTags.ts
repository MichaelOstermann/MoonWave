import { effect, signal } from '@monstermann/signals'
import { $selectedTracks } from '../tracks/selectedTracks'
import { $isSavingTags } from './isSavingTags'
import { $isSidepanelVisible } from './isSidepanelVisible'

export const $hasEditableTags = signal(false)

effect(() => {
    if ($isSavingTags()) return
    if (!$isSidepanelVisible()) return
    $hasEditableTags.set($selectedTracks().length > 0)
})
