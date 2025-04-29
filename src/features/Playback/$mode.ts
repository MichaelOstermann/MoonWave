import type { Mode } from "."
import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"

export const $mode = memo<Mode>(() => Config.$config().mode ?? "SHUFFLE")
