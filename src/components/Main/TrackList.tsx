import type { VListHandle } from 'virtua'
import type { Column, Row } from './types'
import { syncLibrary } from '@app/actions/syncLibrary'
import { useTable } from '@app/hooks/useTable'
import { $focusedView, $tracksFilter, $tracksLSM, $view, $viewingTracks } from '@app/state/state'
import { getLastSelectionPosition } from '@app/utils/lsm/utils/getLastSelectionPosition'
import { measureText } from '@app/utils/measureText'
import { useMenu } from '@app/utils/menu'
import { computed } from '@app/utils/signals/computed'
import { trackToRow } from '@app/utils/trackToRow'
import { useComputed } from '@preact/signals-react'
import { useResizeObserver } from '@react-hookz/web'
import { useEffect, useMemo, useRef, useState } from 'react'
import { VList } from 'virtua'
import { columns, header, minWidths, reservedColumns } from './config'
import { TrackDragGhost } from './TrackDragGhost'
import { TrackListHeader } from './TrackListHeader'
import { TrackListRow } from './TrackListRow'

const $rows = computed<Row[]>(() => $viewingTracks.value.map((track, idx) => {
    return trackToRow(track, idx)
}))

const $measurements = computed(() => {
    const rows = $rows.value
    const fontFamily = getComputedStyle(document.body).fontFamily

    return columns.reduce((acc, col) => {
        acc[col] = rows.map(row => measureText(row[col], {
            fontSize: '14px',
            fontWeight: '400',
            fontFamily,
        }))
        // Measure the header as well, excluding the duration column since it displays an icon and not text.
        if (col !== 'duration') {
            acc[col].push(measureText(header[col], {
                fontSize: '12px',
                fontWeight: '400',
                fontFamily,
            }))
        }
        return acc
    }, {} as Record<Column, number[]>)
})

export function TrackList() {
    const rows = $rows.value
    const ref = useRef<HTMLDivElement>(null)
    const vlistRef = useRef<VListHandle>(null)
    const [availableWidth, setAvailableWidth] = useState(0)
    useResizeObserver(ref as any, ({ contentRect }) => setAvailableWidth(contentRect.width))

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
        measurements: $measurements.value,
        gap,
        outerPadding,
        innerPadding,
    })

    const headerGap = useMemo(() => (<div key="header" style={{ height: 0 }} />), [])
    const footerGap = useMemo(() => (<div key="footer" style={{ height: outerPadding }} />), [outerPadding])
    const trackList = useMemo(() => rows.map((row, idx) => (
        <TrackListRow
            // eslint-disable-next-line react/no-array-index-key
            key={`${row.id}-${idx}`}
            idx={idx}
            row={row}
            colStyles={colStyles}
        />
    )), [rows, colStyles])

    const children = useMemo(() => [
        headerGap,
        ...trackList,
        footerGap,
    ], [headerGap, footerGap, trackList])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => vlistRef.current?.scrollTo(0), [$tracksFilter.value, $view.value])

    const lastSelectedPosition = useComputed(() => getLastSelectionPosition($tracksLSM.value)).value

    useEffect(() => {
        if (lastSelectedPosition < 0) return
        vlistRef.current?.scrollToIndex(lastSelectedPosition + 1, { align: 'nearest' })
    }, [lastSelectedPosition])

    return (
        <div
            ref={ref}
            style={varStyles}
            onContextMenu={menu.show}
            onClick={() => $focusedView.set('MAIN')}
            className="flex w-full shrink grow flex-col"
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
                {children}
            </VList>
        </div>
    )
}
