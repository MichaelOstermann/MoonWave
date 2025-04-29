import type { FocusedView } from "."
import { signal } from "@monstermann/signals"

export const $focused = signal<FocusedView>("SIDEBAR")
