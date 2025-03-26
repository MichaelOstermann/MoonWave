import type { ThemeNameDark, ThemeNameLight } from '@app/types'
import type { ReactNode } from 'react'
import { setDarkTheme } from '@app/actions/app/setDarkTheme'
import { setLightTheme } from '@app/actions/app/setLightTheme'
import { setThemeMode } from '@app/actions/app/setThemeMode'
import { ButtonGroupIcon } from '@app/components/Core/ButtonGroup/ButtonGroupIcon'
import { ButtonGroupRoot } from '@app/components/Core/ButtonGroup/ButtonGroupRoot'
import { Slider } from '@app/components/Core/Slider'
import { themes } from '@app/config/themes'
import { $darkThemeName } from '@app/state/theme/darkThemeName'
import { $lightThemeName } from '@app/state/theme/lightThemeName'
import { $themeMode } from '@app/state/theme/themeMode'
import { useSignal } from '@monstermann/signals'
import { LucideMoon, LucideSun, LucideSwatchBook } from 'lucide-react'
import { titleCase } from 'scule'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

export function Theme(): ReactNode {
    const themeMode = useSignal($themeMode)
    const activeDarkTheme = useSignal($darkThemeName)
    const activeLightTheme = useSignal($lightThemeName)

    return (
        <Section>
            <SectionHeader
                title="Theme"
                icon={LucideSwatchBook}
            >
                <ButtonGroupRoot
                    active={({
                        light: 0,
                        dark: 1,
                    })[themeMode]}
                    onSelectActive={(active) => {
                        if (active === 0) setThemeMode('light')
                        if (active === 1) setThemeMode('dark')
                    }}
                >
                    <ButtonGroupIcon>
                        <LucideSun className="size-4" />
                    </ButtonGroupIcon>
                    <ButtonGroupIcon>
                        <LucideMoon className="size-4" />
                    </ButtonGroupIcon>
                </ButtonGroupRoot>

            </SectionHeader>
            <SectionBody>
                <Slider
                    className="w-full"
                    active={({
                        light: 0,
                        dark: 1,
                    })[themeMode]}
                >
                    <div className="grid w-full grid-cols-[1fr_1fr] items-start gap-3">
                        {themes.light.map((name) => {
                            return (
                                <ThemeOption
                                    key={name}
                                    name={name}
                                    isActive={activeLightTheme === name}
                                    onClick={() => setLightTheme(name)}
                                />
                            )
                        })}
                    </div>
                    <div className="grid w-full grid-cols-[1fr_1fr] items-start gap-3">
                        {themes.dark.map((name) => {
                            return (
                                <ThemeOption
                                    key={name}
                                    name={name}
                                    isActive={activeDarkTheme === name}
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
    name,
    isActive,
    onClick,
}: {
    name: ThemeNameLight | ThemeNameDark
    isActive: boolean
    onClick: () => void
}): ReactNode {
    return (
        <div
            className="relative flex"
            onClick={onClick}
        >
            <div
                data-theme-preview={name}
                className="flex h-20 shrink grow items-center justify-center rounded-md border border-[--border] bg-[--bg] text-sm text-[--fg]"
            >
                {titleCase(name.replace(/(-dark|-light)$/, ''))}
            </div>
            {isActive && <div className="absolute inset-0 rounded-md border-2 border-[--accent]" />}
        </div>
    )
}
