import type { PlaylistColor } from "#src/features/Playlists"
import type { ComponentProps, ReactNode } from "react"
import { useEffect, useRef } from "react"
import { twJoin } from "tailwind-merge"

type DropTarget = "above" | "below" | "inside" | undefined

interface SidebarItemProps extends Omit<ComponentProps<"div">, "color"> {
    color?: PlaylistColor
    depth?: number
    dropTarget?: DropTarget
    isActive: boolean
    isEditing?: boolean
    isPlaying: boolean
    isSelected: boolean
    showBorder?: boolean
}

export function SidebarItem({
    children,
    className,
    color,
    depth = 0,
    dropTarget,
    isActive,
    isEditing = false,
    isPlaying,
    isSelected,
    ref,
    showBorder = false,
    style,
    ...rest
}: SidebarItemProps): ReactNode {
    const rootRef = useRef<HTMLDivElement>(null)
    const depthPadding = depth * 12

    useEffect(() => {
        if (!isEditing && !isSelected) return
        rootRef.current?.scrollIntoView({ block: "nearest" })
    }, [isEditing, isSelected])

    return (
        <div
            {...rest}
            className="relative flex shrink-0 py-px select-none"
            style={{ paddingLeft: depthPadding }}
            ref={function (el) {
                rootRef.current = el
                if (typeof ref === "function") ref(el)
                else if (ref) ref.current = el
            }}
        >
            {dropTarget === "above" && <div className="absolute inset-x-2 -top-px h-[2px] bg-(--accent)" style={{ marginLeft: depthPadding }} />}
            {dropTarget === "below" && <div className="absolute inset-x-2 -bottom-px h-[2px] bg-(--accent)" style={{ marginLeft: depthPadding }} />}
            <div
                data-active={isActive}
                data-border={showBorder}
                data-color={!!color}
                data-playing={isPlaying}
                data-selected={isSelected}
                className={twJoin(
                    "group flex h-8 shrink grow items-center gap-x-1.5 rounded-md px-1.5 text-sm",
                    "data-[active=false]:data-[selected=true]:data-[border=false]:bg-(--bg-selected)",
                    "data-[active=true]:data-[border=false]:bg-(--bg-accent)",
                    "data-[border=true]:shadow-[0_0_0_2px_var(--accent)]",
                    className,
                )}
                style={{
                    ...style,
                    "--accent": color ? `var(--accent-${color.value})` : undefined,
                    "--bg-accent": color ? `var(--bg-${color.value})` : undefined,
                    "--fg-accent": color ? `var(--fg-${color.value})` : undefined,
                }}
            >
                {children}
            </div>
        </div>
    )
}
