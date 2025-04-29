import type { PlaylistColor } from "#src/features/Playlists"
import type { ComponentProps, ReactNode } from "react"
import { colors } from "#config/colors"
import { twMerge } from "tailwind-merge"

interface IconColorsProps extends ComponentProps<"div"> {
    activeColor: PlaylistColor | undefined
    onSelectColor: (color: PlaylistColor | undefined) => void
}

export function IconColors({
    activeColor,
    className,
    onSelectColor,
}: IconColorsProps): ReactNode {
    return (
        <div
            className={twMerge(
                "grid shrink grow grid-cols-[repeat(auto-fit,minmax(24px,1fr))] gap-2",
                className,
            )}
        >
            <IconColor
                isActive={activeColor === undefined}
                onClick={() => onSelectColor?.(undefined)}
                value={undefined}
            />
            {colors.map(color => (
                <IconColor
                    isActive={activeColor?.type === "PRESET" && activeColor.value === color}
                    key={color}
                    onClick={() => onSelectColor?.({ type: "PRESET", value: color })}
                    value={{ type: "PRESET", value: color }}
                />
            ))}
        </div>
    )
}

interface IconColorProps extends ComponentProps<"div"> {
    isActive: boolean
    value: PlaylistColor | undefined
}

function IconColor({
    isActive,
    value,
    ...rest
}: IconColorProps): ReactNode {
    return (
        <div {...rest}>
            <div
                className="relative flex size-6 items-center justify-center rounded-full bg-(--outer) transition-transform duration-300 ease-in-out active:scale-[0.8]"
                style={{
                    "--inner": value ? `var(--fg-${value.value})` : "var(--fg)",
                    "--outer": value ? `var(--bg-${value.value})` : "var(--bg-hover)",
                }}
            >
                <div
                    className="absolute size-full scale-[0.3] rounded-full bg-(--inner) transition-transform duration-300 ease-in-out data-[active=true]:scale-100"
                    data-active={isActive}
                />
            </div>
        </div>
    )
}
