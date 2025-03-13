import type { ModalStatus, Tooltip, TooltipOptions } from './types'
import { $winHeight, $winWidth, changeEffect, computed, effect, onCleanup, signal, waitFor } from '@monstermann/signals'
import debounce from 'debounce'
import { clamp } from '../data/clamp'
import { observeDimensions } from '../dom/observeDimensions'
import { observePosition } from '../dom/observePosition'
import { onAncestorScroll } from '../dom/onAncestorScroll'
import { getTooltip, modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

export function createTooltip(
    id: string,
    options: Partial<TooltipOptions> = {},
): Tooltip {
    const existing = getTooltip(id)
    if (existing) return existing

    let dependents = 0
    const ac = new AbortController()

    const isOpen = signal(false)
    const status = signal<ModalStatus>('closed')

    const offset = signal(options.offset ?? 4)
    const paddingTop = signal(options.paddingTop ?? 10)
    const paddingLeft = signal(options.paddingLeft ?? 6)
    const paddingRight = signal(options.paddingRight ?? 6)
    const paddingBottom = signal(options.paddingBottom ?? 10)

    const anchorElement = signal<HTMLElement>(null)
    const floatingElement = signal<HTMLElement>(null)

    const anchorRect = signal<DOMRectReadOnly>(null)
    const anchorWidth = computed(() => anchorRect()?.width ?? 0)
    const anchorHeight = computed(() => anchorRect()?.height ?? 0)
    const anchorTop = computed(() => anchorRect()?.top ?? 0)
    const anchorLeft = computed(() => anchorRect()?.left ?? 0)
    const anchorBottom = computed(() => anchorTop() + anchorHeight())
    const anchorCenter = computed(() => anchorLeft() + anchorWidth() / 2)

    const floatingRect = signal<DOMRectReadOnly>(null)
    const floatingWidth = computed(() => floatingRect()?.width ?? 0)
    const floatingHeight = computed(() => floatingRect()?.height ?? 0)

    const maxHeightAbove = computed(() => anchorTop() - offset() - paddingTop())
    const maxHeightBelow = computed(() => $winHeight() - anchorBottom() - offset() - paddingBottom())
    const placement = computed(() => maxHeightBelow() >= floatingHeight() ? 'below' : 'above')
    const matchPlacement = (placements: { above: number, below: number }): number => placements[placement()]

    const maxHeight = computed(() => matchPlacement({
        above: maxHeightAbove(),
        below: maxHeightBelow(),
    }))

    const x = computed(() => clamp(
        anchorCenter() - floatingWidth() / 2,
        paddingLeft(),
        $winWidth() - floatingWidth() - paddingRight(),
    ))
    const y = computed(() => matchPlacement({
        above: anchorTop() - floatingHeight() - offset(),
        below: anchorBottom() + offset(),
    }))

    const originX = computed(() => floatingWidth() / 2)
    const originY = computed(() => matchPlacement({
        above: floatingHeight(),
        below: 0,
    }))

    const tooltip: Tooltip = {
        type: 'tooltip',
        id,
        isOpen,
        status,
        offset,
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom,
        anchorElement,
        floatingElement,
        maxHeight,
        placement,
        x,
        y,
        originX,
        originY,
        open,
        close,
        register,
    }

    const dispose = debounce(() => {
        if (dependents > 0) return
        modals.delete(id)
        ac.abort()
    }, 100)

    function register() {
        dependents++
        modals.set(id, tooltip)
        return () => {
            dependents--
            dispose()
        }
    }

    function open() {
        isOpen.set(true)
        return waitFor(() => status() === 'opened')
    }

    function close() {
        isOpen.set(false)
        return waitFor(() => status() === 'closed')
    }

    effect(() => {
        if (!isOpen()) return

        const anchor = anchorElement()
        const floating = floatingElement()
        if (!anchor || !floating) return

        anchorRect.set(anchor.getBoundingClientRect())
        floatingRect.set(floating.getBoundingClientRect())

        onCleanup(observePosition(anchor, anchorRect.set))
        onCleanup(observeDimensions(floating, floatingRect.set))
        onCleanup(onAncestorScroll(anchor, close))
    }, { abort: ac.signal })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) onOpenModal(tooltip)
        else onCloseModal(tooltip)
    }, { abort: ac.signal })

    changeEffect(status, (status) => {
        if (status === 'opening') onOpeningModal(tooltip)
        else if (status === 'opened') onOpenedModal(tooltip)
        else if (status === 'closing') onClosingModal(tooltip)
        else if (status === 'closed') onClosedModal(tooltip)
    }, { abort: ac.signal })

    return tooltip
}
