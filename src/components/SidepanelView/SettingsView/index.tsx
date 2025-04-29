import type { ReactNode } from "react"
import { Sections } from "../Sections"
import { ThemeView } from "./ThemeView"
import { WaveformView } from "./WaveformView"

export function SettingsView(): ReactNode {
    return (
        <Sections>
            <WaveformView />
            <ThemeView />
        </Sections>
    )
}
