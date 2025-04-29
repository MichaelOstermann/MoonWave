import type { ThemeNameDark } from "."
import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"

export const $darkName = memo<ThemeNameDark>(() => Config.$config().darkThemeName || "moon-dark")
