import type { VListHandle } from 'virtua'
import type { Column, Row } from './types'
import { syncLibrary } from '@app/actions/app/syncLibrary'
import { useTable } from '@app/hooks/useTable'
import { $mainWidth } from '@app/state/app/mainWidth'
import { $focusedView } from '@app/state/sidebar/focusedView'
import { $view } from '@app/state/sidebar/view'
import { $isTogglingSidepanel } from '@app/state/sidepanel/isTogglingSidepanel'
import { $tracksFilter } from '@app/state/tracks/tracksFilter'
import { $tracksLSM } from '@app/state/tracks/tracksLSM'
import { $viewingTracks } from '@app/state/tracks/viewingTracks'
import { getLastSelectionPosition } from '@app/utils/lsm/utils/getLastSelectionPosition'
import { measureText } from '@app/utils/measureText'
import { useMenu } from '@app/utils/menu'
import { trackToRow } from '@app/utils/trackToRow'
import { computed, useSignal } from '@monstermann/signals'
import { useUpdateEffect } from '@react-hookz/web'
import { useEffect, useRef } from 'react'
import { VList } from 'virtua'
import { columns, header, minWidths, reservedColumns } from './config'
import { TrackDragGhost } from './TrackDragGhost'
import { TrackListHeader } from './TrackListHeader'
import { TrackListRow } from './TrackListRow'

const $rows = computed<Row[]>(() => $viewingTracks().map((track, idx) => {
    return trackToRow(track, idx)
}))

const fontFamily = getComputedStyle(document.body).fontFamily
const rowFont = `400 14px ${fontFamily}`
const headerFont = `400 12px ${fontFamily}`

const $measurements = computed(() => {
    const rows = $rows()

    return columns.reduce((acc, col) => {
        acc[col] = rows.map(row => measureText(row[col], {
            font: rowFont,
            monospace: col === 'position' || col === 'duration',
        }))
        // Measure the header as well, excluding the duration column since it displays an icon and not text.
        if (col !== 'duration') {
            acc[col].push(measureText(header[col], {
                font: headerFont,
                monospace: false,
            }))
        }
        return acc
    }, {} as Record<Column, number[]>)
})

export function TrackList() {
    const rows = useSignal($rows)
    const measurements = useSignal($measurements)
    const ref = useRef<HTMLDivElement>(null)
    const vlistRef = useRef<VListHandle>(null)
    const availableWidth = useSignal($mainWidth)
    const isTogglingSidepanel = useSignal($isTogglingSidepanel)

    const gap = 20
    const outerPadding = 10
    const innerPadding = 10

    const menu = useMenu([
        { text: 'Sync Library', action: syncLibrary },
    ])

    const { outerStyles, colStyles, varStyles } = useTable({
        columns,
        availableWidth,
        reservedColumns,
        minWidths,
        measurements,
        gap,
        outerPadding,
        innerPadding,
        colStyles: isTogglingSidepanel ? { transition: 'width 300ms var(--ease-in-out)' } : undefined,
    })

    const headerGap = <div key="header" style={{ height: 0 }} />
    const footerGap = <div key="footer" style={{ height: outerPadding }} />
    const trackList = rows.map((row, idx) => (
        <TrackListRow
            key={`${row.id}-${idx}`}
            idx={idx}
            row={row}
            colStyles={colStyles}
        />
    ))

    useUpdateEffect(() => vlistRef.current?.scrollTo(0), [
        useSignal($tracksFilter),
        useSignal($view),
    ])

    const lastSelectedPosition = useSignal(() => getLastSelectionPosition($tracksLSM()))

    useEffect(() => {
        if (lastSelectedPosition < 0) return
        vlistRef.current?.scrollToIndex(lastSelectedPosition + 1, { align: 'nearest' })
    }, [lastSelectedPosition])

    return (
        <div
            ref={ref}
            onContextMenu={menu.show}
            onClick={() => $focusedView.set('MAIN')}
            className="flex w-full shrink grow flex-col"
            style={varStyles}
        >
            <TrackDragGhost />
            <TrackListHeader
                style={outerStyles}
                colStyles={colStyles}
            />
            <VList
                ref={vlistRef}
                overscan={20}
                className="flex shrink grow"
                style={outerStyles}
            >
                {[
                    headerGap,
                    ...trackList,
                    footerGap,
                ]}
            </VList>
        </div>
    )
}
