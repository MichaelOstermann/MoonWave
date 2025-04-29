import type { ThemeNameDark, ThemeNameLight } from "#features/Theme"
import type { ReactNode } from "react"
import { setDarkTheme } from "#actions/app/setDarkTheme"
import { setLightTheme } from "#actions/app/setLightTheme"
import { setThemeMode } from "#actions/app/setThemeMode"
import { ButtonGroup } from "#components/Core/ButtonGroup"
import { Slider } from "#components/Core/Slider"
import { themes } from "#config/themes"
import { Theme } from "#features/Theme"
import { String } from "@monstermann/fn"
import { LucideMoon, LucideSun, LucideSwatchBook } from "lucide-react"
import { Section } from "../Section"
import { SectionBody } from "../SectionBody"
import { SectionHeader } from "../SectionHeader"

export function ThemeView(): ReactNode {
    const themeMode = Theme.$mode()
    const activeDarkTheme = Theme.$darkName()
    const activeLightTheme = Theme.$lightName()

    return (
        <Section>
            <SectionHeader
                icon={LucideSwatchBook}
                title="Theme"
            >
                <ButtonGroup.Root
                    active={({
                        dark: 1,
                        light: 0,
                    })[themeMode]}
                    onSelectActive={(active) => {
                        if (active === 0) setThemeMode("light")
                        if (active === 1) setThemeMode("dark")
                    }}
                >
                    <ButtonGroup.Icon>
                        <LucideSun className="size-4" />
                    </ButtonGroup.Icon>
                    <ButtonGroup.Icon>
                        <LucideMoon className="size-4" />
                    </ButtonGroup.Icon>
                </ButtonGroup.Root>

            </SectionHeader>
            <SectionBody>
                <Slider
                    className="w-full"
                    active={({
                        dark: 1,
                        light: 0,
                    })[themeMode]}
                >
                    <div className="grid w-full grid-cols-[1fr_1fr] items-start gap-3">
                        {themes.light.map((name) => {
                            return (
                                <ThemeOption
                                    isActive={activeLightTheme === name}
                                    key={name}
                                    name={name}
                                    onClick={() => setLightTheme(name)}
                                />
                            )
                        })}
                    </div>
                    <div className="grid w-full grid-cols-[1fr_1fr] items-start gap-3">
                        {themes.dark.map((name) => {
                            return (
                                <ThemeOption
                                    isActive={activeDarkTheme === name}
                                    key={name}
                                    name={name}
                                    onClick={() => setDarkTheme(name)}
                                />
                            )
                        })}
                    </div>
                </Slider>
            </SectionBody>
        </Section>
    )
}

function ThemeOption({
    isActive,
    name,
    onClick,
}: {
    isActive: boolean
    name: ThemeNameLight | ThemeNameDark
    onClick: () => void
}): ReactNode {
    return (
        <div
            className="relative flex"
            onClick={onClick}
        >
            <div
                className="flex h-20 shrink grow items-center justify-center rounded-md border border-(--border) bg-(--bg) text-sm text-(--fg)"
                data-theme-preview={name}
            >
                {String.titleCase(name.replace(/(-dark|-light)$/, ""))}
            </div>
            {isActive && <div className="absolute inset-0 rounded-md border-2 border-(--accent)" />}
        </div>
    )
}
