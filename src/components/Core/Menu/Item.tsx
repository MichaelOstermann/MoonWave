import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { closeLastModal } from "@monstermann/signals-modal"
import { createElement } from "react"

export function Item({ icon, onSelect, text }: {
    icon: LucideIcon
    text: string
    onSelect: () => void
}): ReactNode {
    return (
        <div
            className="flex px-2"
            onClick={function () {
                closeLastModal()
                onSelect()
            }}
        >
            <div className="flex h-9 shrink grow items-center gap-x-2 rounded-md px-1.5 text-sm hover:bg-(--bg-hover)">
                <div className="flex size-[22px] items-center justify-center">
                    {createElement(icon, { className: "size-4" })}
                </div>
                <span>
                    {text}
                </span>
            </div>
        </div>
    )
}
