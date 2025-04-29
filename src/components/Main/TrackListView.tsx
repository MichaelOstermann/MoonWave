import type { Column, Row } from "./types"
import { selectAndImportFiles } from "#actions/app/selectAndImportFiles"
import { syncLibrary } from "#actions/app/syncLibrary"
import { List } from "#components/Core/List"
import { Menu } from "#components/Core/Menu"
import { Popover } from "#components/Core/Popover"
import { LSM } from "#features/LSM"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { Views } from "#features/Views"
import { useModal } from "#hooks/useModal"
import { useTable } from "#hooks/useTable"
import { Modals } from "#src/features/Modals"
import { measureText } from "#utils/measureText"
import { memo } from "@monstermann/signals"
import { useSignal } from "@monstermann/signals-react"
import { useUpdateEffect } from "@react-hookz/web"
import { LucideImport, LucideRefreshCw } from "lucide-react"
import { useEffect, useRef } from "react"
import { columns, header, minWidths, reservedColumns } from "./config"
import { TrackDragGhost } from "./TrackDragGhost"
import { TrackListHeader } from "./TrackListHeader"
import { TrackListRow } from "./TrackListRow"

const $rows = memo<Row[]>(() => TrackList.$tracks().map((track, idx) => {
    return TrackList.toRow(track, idx)
}))

const fontFamily = getComputedStyle(document.body).fontFamily
const rowFont = `400 14px ${fontFamily}`
const headerFont = `400 12px ${fontFamily}`

const $measurements = memo(() => {
    const rows = $rows()

    return columns.reduce((acc, col) => {
        acc[col] = rows.map(row => measureText(row[col], {
            font: rowFont,
            monospace: col === "position" || col === "duration",
        }))
        // Measure the header as well, excluding the duration column since it displays an icon and not text.
        if (col !== "duration") {
            acc[col].push(measureText(header[col], {
                font: headerFont,
                monospace: false,
            }))
        }
        return acc
    }, {} as Record<Column, number[]>)
})

export function TrackListView() {
    const rows = $rows()
    const measurements = $measurements()
    const ref = useRef<HTMLDivElement>(null)
    const vlistRef = useRef<HTMLDivElement>(null)
    const availableWidth = TrackList.$width()
    const contextMenu = useModal(() => Modals.createContextMenu({ key: "track-list" }))

    const gap = 20
    const rowHeight = 32
    const outerPadding = 10
    const innerPadding = 10

    const { colStyles, outerStyles, varStyles } = useTable({
        availableWidth,
        columns,
        gap,
        innerPadding,
        measurements,
        minWidths,
        outerPadding,
        reservedColumns,
    })

    useUpdateEffect(() => vlistRef.current?.scrollTo(0, 0), [
        useSignal(Sidebar.$search),
        useSignal(Views.$selected),
    ])

    const lastSelectedPosition = LSM.getLastSelectionPosition(TrackList.$LSM())

    useEffect(() => {
        if (lastSelectedPosition < 0) return
        const container = vlistRef.current
        if (!container) return

        const targetIndex = lastSelectedPosition
        const targetTop = targetIndex * rowHeight
        const targetBottom = targetTop + rowHeight
        const scrollTop = container.scrollTop
        const viewportHeight = container.clientHeight

        if (targetTop < scrollTop) {
            // Target is above viewport, scroll to top of target
            container.scrollTo({ behavior: "auto", top: targetTop })
        }
        else if (targetBottom > scrollTop + viewportHeight) {
            // Target is below viewport, scroll to bottom of target
            container.scrollTo({ behavior: "auto", top: targetBottom - viewportHeight })
        }
    }, [lastSelectedPosition])

    return (
        <div
            className="flex w-full shrink grow flex-col"
            onClick={() => Views.$focused("MAIN")}
            ref={ref}
            style={varStyles}
            onContextMenu={function (evt) {
                evt.preventDefault()
                evt.stopPropagation()
                contextMenu?.open()
            }}
        >
            <TrackDragGhost />
            <TrackListHeader
                colStyles={colStyles}
                style={outerStyles}
            />
            <List
                className="flex shrink grow"
                height={rowHeight}
                items={rows}
                overscan={20}
                ref={vlistRef}
                style={{ ...outerStyles, paddingBottom: outerPadding }}
                render={function ({ idx, item }) {
                    return (
                        <TrackListRow
                            colStyles={colStyles}
                            idx={idx}
                            row={item}
                        />
                    )
                }}
            />
            <Popover.Root popover={contextMenu}>
                <Popover.Floating>
                    <Popover.Content>
                        <Menu.Root>
                            <Menu.Item
                                icon={LucideImport}
                                onSelect={() => selectAndImportFiles({ playlistId: undefined })}
                                text="Import Tracks"
                            />
                            <Menu.Item
                                icon={LucideRefreshCw}
                                onSelect={syncLibrary}
                                text="Update Library"
                            />
                        </Menu.Root>
                    </Popover.Content>
                    <Popover.BackgroundBlur />
                </Popover.Floating>
            </Popover.Root>
        </div>
    )
}
