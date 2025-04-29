import { Config } from "#features/Config"
import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $width = memo(() => Sidebar.getWidth(Config.$config().sidebarWidth))
