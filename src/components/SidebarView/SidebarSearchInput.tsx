import type { ReactNode } from "react"
import { filterLibrary } from "#actions/tracks/filterLibrary"
import { Sidebar } from "#features/Sidebar"
import { LucideSearch, LucideX } from "lucide-react"
import { Input, useInput } from "../Core/Input"

export function SidebarSearchInput(): ReactNode {
    const value = Sidebar.$search()
    const input = useInput({
        placeholder: "Search",
        value,
        onEscape: () => filterLibrary(""),
        onUpdate: value => filterLibrary(value),
    })

    return (
        <div
            className="group flex shrink-0 px-2"
            onClick={evt => evt.stopPropagation()}
        >
            <Input.Root className="h-8" input={input}>
                <Input.Left className="size-8">
                    <LucideSearch className="size-4" />
                </Input.Left>
                <Input.Field className="sidebar-search-input px-8" />
                <Input.Right
                    className="size-8"
                    onClick={() => filterLibrary("")}
                    show={value !== ""}
                >
                    <LucideX className="size-4" />
                </Input.Right>
            </Input.Root>
        </div>
    )
}
