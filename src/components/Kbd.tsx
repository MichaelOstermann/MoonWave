import type { ReactNode } from 'react'
import { parseShortcut } from '@monstermann/hotkeys/vscode'
import { LucideArrowBigUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight, LucideArrowUp, LucideChevronUp, LucideCommand, LucideOption, LucideSpace } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { match, P } from 'ts-pattern'

export function Kbd({ value, className }: { value: string, className?: string }): ReactNode {
    return (
        <kbd
            className={twMerge(
                'flex items-center gap-x-0.5 text-[--fg-soft]',
                className,
            )}
        >
            {parseShortcut(value)
                .flatMap(({ key, ...mods }) => [mods, { key }])
                .map((part, idx) => {
                    const key = idx

                    return match(part)
                        .with({ meta: true }, () => <LucideCommand key={key} className="size-3" />)
                        .with({ alt: true }, () => <LucideOption key={key} className="size-3" />)
                        .with({ ctrl: true }, () => <LucideChevronUp key={key} className="size-3" />)
                        .with({ shift: true }, () => <LucideArrowBigUp key={key} className="size-3" />)
                        .with({ key: 'ArrowUp' }, () => <LucideArrowUp key={key} className="size-3" />)
                        .with({ key: 'ArrowLeft' }, () => <LucideArrowLeft key={key} className="size-3" />)
                        .with({ key: 'ArrowDown' }, () => <LucideArrowDown key={key} className="size-3" />)
                        .with({ key: 'ArrowRight' }, () => <LucideArrowRight key={key} className="size-3" />)
                        .with({ key: 'Space' }, () => <LucideSpace key={key} className="size-3" />)
                        .with({ key: P.string }, part => (
                            <span key={key} className="w-3 text-center text-sm">
                                {part.key.toUpperCase()}
                            </span>
                        ))
                        .otherwise(() => null)
                })}
        </kbd>
    )
}
