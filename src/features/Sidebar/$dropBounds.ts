import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $dropBounds = memo(() => Sidebar.$dropElement()?.getBoundingClientRect())
