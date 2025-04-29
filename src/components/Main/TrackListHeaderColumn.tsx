import type { CSSProperties, ReactNode } from "react"
import type { Column } from "./types"
import { twJoin } from "tailwind-merge"
import { header } from "./config"

export function TrackListHeaderColumn({ col, style }: {
    col: Column
    style: CSSProperties
}): ReactNode {
    return (
        <div
            data-column={col}
            style={style}
            className={twJoin(
                "flex items-center",
                col === "position" && "justify-end",
                col === "duration" && "justify-end",
            )}
        >
            <span className="truncate">
                {header[col]}
            </span>
        </div>
    )
}
