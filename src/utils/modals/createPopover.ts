import type { ModalStatus, Popover, PopoverOptions } from './types'
import debounce from 'debounce'
import { clamp } from '../data/clamp'
import { removeEntry } from '../data/removeEntry'
import { setEntry } from '../data/setEntry'
import { observeDimensions } from '../dom/observeDimensions'
import { observePosition } from '../dom/observePosition'
import { $winHeight, $winWidth } from '../signals/browser'
import { changeEffect } from '../signals/changeEffect'
import { onCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
import { effect } from '../signals/effect'
import { signal } from '../signals/signal'
import { getPopover, modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

export function createPopover(
    id: string,
    options: Partial<PopoverOptions> = {},
): Popover {
    const existing = getPopover(id)
    if (existing) return existing

    let dependents = 0
    const ac = new AbortController()

    const isOpen = signal(false)
    const isEnabled = signal(options.enabled ?? true)
    const status = signal<ModalStatus>('closed')

    const offset = signal(options.offset ?? 4)
    const borderWidth = signal(options.borderWidth ?? 1)
    const arrowWidth = signal(options.arrowWidth ?? 20)
    const arrowHeight = signal(options.arrowHeight ?? 12)
    const arrowRadius = signal(options.arrowRadius ?? 3)
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

    const maxHeightAbove = computed(() => anchorTop() - offset() - arrowHeight() - paddingTop())
    const maxHeightBelow = computed(() => $winHeight() - anchorBottom() - offset() - arrowHeight() - paddingBottom())
    const maxHeight = computed(() => Math.max(maxHeightAbove(), maxHeightBelow()))
    const placement = computed(() => maxHeightAbove() > maxHeightBelow() ? 'above' : 'below')
    const matchPlacement = (placements: { above: number, below: number }): number => placements[placement()]

    const x = computed(() => clamp(
        anchorCenter() - floatingWidth() / 2,
        paddingLeft(),
        $winWidth() - floatingWidth() - paddingRight(),
    ))
    const y = computed(() => matchPlacement({
        above: anchorTop() - floatingHeight() - arrowHeight() - offset(),
        below: anchorBottom() + arrowHeight() + offset(),
    }))

    const arrowX = computed(() => anchorCenter() - (arrowWidth() / 2) - x() - (borderWidth() * 2))
    const arrowY = computed(() => matchPlacement({
        above: floatingHeight() - borderWidth() * 2,
        below: -arrowHeight(),
    }))

    const originX = computed(() => arrowX() + arrowWidth() / 2)
    const originY = computed(() => matchPlacement({
        above: floatingHeight() + arrowHeight(),
        below: -arrowHeight(),
    }))

    const popover: Popover = {
        type: 'popover',
        id,
        isOpen,
        isEnabled,
        status,
        offset,
        borderWidth,
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom,
        arrowWidth,
        arrowHeight,
        arrowRadius,
        anchorElement,
        floatingElement,
        hasMeasurements,
        maxHeight,
        placement,
        x,
        y,
        arrowX,
        arrowY,
        originX,
        originY,
        open,
        close,
        register,
    }

    const dispose = debounce(() => {
        if (dependents > 0) return
        modals.map(removeEntry(id))
        ac.abort()
    }, 100)

    function register() {
        dependents++
        modals.map(setEntry(id, popover))
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

        onCleanup(observePosition(anchor, anchorRect.set))
        onCleanup(observeDimensions(floating, floatingRect.set))
    }, { abort: ac.signal })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) onOpenModal(popover)
        else onCloseModal(popover)
    }, { abort: ac.signal })

    changeEffect(status, (status) => {
        if (status === 'opening') onOpeningModal(popover)
        else if (status === 'opened') onOpenedModal(popover)
        else if (status === 'closing') onClosingModal(popover)
        else if (status === 'closed') onClosedModal(popover)
    }, { abort: ac.signal })

    return popover
}
