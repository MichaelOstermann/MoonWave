import type { ReactNode } from "react"
import { match, Object } from "@monstermann/fn"
import { Hotkeys } from "@monstermann/hotkeys"
import { LucideArrowBigUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight, LucideArrowUp, LucideChevronUp, LucideCommand, LucideOption, LucideSpace } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function Kbd({ className, value }: { className?: string, value: string }): ReactNode {
    return (
        <kbd
            className={twMerge(
                "flex items-center gap-x-0.5 text-(--fg-soft)",
                className,
            )}
        >
            {Hotkeys
                .vsc(value)
                .flatMap(({ key, ...mods }) => [mods, { key }])
                .map((part, idx) => {
                    const key = idx

                    return match
                        .shape(part)
                        .onCase({ meta: true }, () => <LucideCommand className="size-3" key={key} />)
                        .onCase({ alt: true }, () => <LucideOption className="size-3" key={key} />)
                        .onCase({ ctrl: true }, () => <LucideChevronUp className="size-3" key={key} />)
                        .onCase({ shift: true }, () => <LucideArrowBigUp className="size-3" key={key} />)
                        .onCase({ key: "ArrowUp" }, () => <LucideArrowUp className="size-3" key={key} />)
                        .onCase({ key: "ArrowLeft" }, () => <LucideArrowLeft className="size-3" key={key} />)
                        .onCase({ key: "ArrowDown" }, () => <LucideArrowDown className="size-3" key={key} />)
                        .onCase({ key: "ArrowRight" }, () => <LucideArrowRight className="size-3" key={key} />)
                        .onCase({ key: "Space" }, () => <LucideSpace className="size-3" key={key} />)
                        .onCond(Object.hasProp("key"), part => (
                            <span className="w-3 text-center text-sm" key={key}>
                                {part.key.toUpperCase()}
                            </span>
                        ))
                        .or(null)
                })}
        </kbd>
    )
}
