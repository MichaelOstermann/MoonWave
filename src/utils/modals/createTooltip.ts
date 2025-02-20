import type { ModalStatus, Tooltip, TooltipOptions } from './types'
import { batch } from '@preact/signals-core'
import debounce from 'debounce'
import { clamp } from '../data/clamp'
import { removeEntry } from '../data/removeEntry'
import { setEntry } from '../data/setEntry'
import { observeDimensions } from '../dom/observeDimensions'
import { observePosition } from '../dom/observePosition'
import { onAncestorScroll } from '../dom/onAncestorScroll'
import { changeEffect } from '../signals/changeEffect'
import { withCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
import { effect } from '../signals/effect'
import { event } from '../signals/event'
import { signal } from '../signals/signal'
import { getTooltip, modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

// TODO
const windowWidth = signal(window.innerWidth)
const windowHeight = signal(window.innerHeight)
window.addEventListener('resize', () => batch(() => {
    windowWidth.set(window.innerWidth)
    windowHeight.set(window.innerHeight)
}))

export function createTooltip(
    id: string,
    options: Partial<TooltipOptions> = {},
): Tooltip {
    const existing = getTooltip(id)
    if (existing) return existing

    let dependents = 0
    const ac = new AbortController()

    const isOpen = signal(false)
    const isEnabled = signal(options.enabled ?? true)
    const status = signal<ModalStatus>('closed')

    const offset = signal(options.offset ?? 4)
    const paddingTop = signal(options.paddingTop ?? 10)
    const paddingLeft = signal(options.paddingLeft ?? 6)
    const paddingRight = signal(options.paddingRight ?? 6)
    const paddingBottom = signal(options.paddingBottom ?? 10)

    const anchorElement = signal<HTMLElement>(null)
    const floatingElement = signal<HTMLElement>(null)
    const hasMeasurements = computed(() => !!(anchorElement() && floatingElement()))

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
    const maxHeightBelow = computed(() => windowHeight() - anchorBottom() - offset() - paddingBottom())
    const placement = computed(() => maxHeightBelow() >= floatingHeight() ? 'below' : 'above')
    const matchPlacement = (placements: { above: number, below: number }): number => placements[placement()]

    const maxHeight = computed(() => matchPlacement({
        above: maxHeightAbove(),
        below: maxHeightBelow(),
    }))

    const x = computed(() => clamp(
        anchorCenter() - floatingWidth() / 2,
        paddingLeft(),
        windowWidth() - floatingWidth() - paddingRight(),
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
        isEnabled,
        status,
        offset,
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom,
        anchorElement,
        floatingElement,
        hasMeasurements,
        maxHeight,
        placement,
        x,
        y,
        originX,
        originY,
        open,
        close,
        register,
        onOpen: event({ abort: ac.signal }),
        onClose: event({ abort: ac.signal }),
        onOpening: event({ abort: ac.signal }),
        onOpened: event({ abort: ac.signal }),
        onClosing: event({ abort: ac.signal }),
        onClosed: event({ abort: ac.signal }),
    }

    const dispose = debounce(() => {
        if (dependents > 0) return
        modals.map(removeEntry(id))
        ac.abort()
    }, 100)

    function register() {
        dependents++
        modals.map(setEntry(id, tooltip))
        return () => {
            dependents--
            dispose()
        }
    }

    function open() {
        if (!isEnabled()) return
        isOpen.set(true)
    }

    function close() {
        isOpen.set(false)
    }

    effect(() => {
        if (!isEnabled()) close()
    }, { abort: ac.signal })

    effect(() => {
        if (!isOpen()) return

        const anchor = anchorElement()
        const floating = floatingElement()
        if (!anchor || !floating) return

        anchorRect.set(anchor.getBoundingClientRect())
        floatingRect.set(floating.getBoundingClientRect())

        withCleanup(observePosition(anchor, anchorRect.set))
        withCleanup(observeDimensions(floating, floatingRect.set))
        withCleanup(onAncestorScroll(anchor, close))
    }, { abort: ac.signal })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) {
            tooltip.onOpen.emit(tooltip)
            onOpenModal.emit(tooltip)
        }
        else {
            tooltip.onClose.emit(tooltip)
            onCloseModal.emit(tooltip)
        }
    }, { abort: ac.signal })

    changeEffect(status, (status) => {
        if (status === 'opening') {
            tooltip.onOpening.emit(tooltip)
            onOpeningModal.emit(tooltip)
        }
        else if (status === 'opened') {
            tooltip.onOpened.emit(tooltip)
            onOpenedModal.emit(tooltip)
        }
        else if (status === 'closing') {
            tooltip.onClosing.emit(tooltip)
            onClosingModal.emit(tooltip)
        }
        else if (status === 'closed') {
            tooltip.onClosed.emit(tooltip)
            onClosedModal.emit(tooltip)
        }
    }, { abort: ac.signal })

    return tooltip
}
