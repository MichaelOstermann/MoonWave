import type { Config } from "."
import { signal } from "@monstermann/signals"

export const $config = signal<Config>({})
