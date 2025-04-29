import type { ThemeMode } from "."
import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"

export const $mode = memo<ThemeMode>(() => Config.$config().themeMode || "dark")
