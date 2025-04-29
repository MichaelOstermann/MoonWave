import { Sidebar } from "#features/Sidebar"
import { pipe } from "@monstermann/fn"
import { memo } from "@monstermann/signals"
import { $windowWidth } from "@monstermann/signals-web"

export const $width = memo(() => pipe(
    $windowWidth(),
    w => w - Sidebar.$width(),
))
