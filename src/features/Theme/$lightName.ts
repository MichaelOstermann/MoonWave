import type { ThemeNameLight } from "."
import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"

export const $lightName = memo<ThemeNameLight>(() => Config.$config().lightThemeName || "wave-light")
