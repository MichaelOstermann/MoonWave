import type { ModalStatus, Popover, PopoverOptions } from './types'
import { $winHeight, $winWidth, computed, effect, onChange, onCleanup, signal, waitFor } from '@monstermann/signals'
import debounce from 'debounce'
import { clamp } from '../data/clamp'
import { observeDimensions } from '../dom/observeDimensions'
import { observePosition } from '../dom/observePosition'
import { getPopover, modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

export function createPopover(
    id: string,
    options: Partial<PopoverOptions> = {},
): Popover {
    const existing = getPopover(id)
    existing?.offset.set(options.offset ?? 4)
    if (existing) return existing

    let dependents = 0
    const ac = new AbortController()

    const isOpen = signal(false)
    const status = signal<ModalStatus>('closed')

    const offset = signal(options.offset ?? 4)
    const borderWidth = signal(options.borderWidth ?? 1)
    const arrowWidth = signal(options.enableArrow ? (options.arrowWidth ?? 20) : 0)
    const arrowHeight = signal(options.enableArrow ? (options.arrowHeight ?? 12) : 0)
    const arrowRadius = signal(options.arrowRadius ?? 3)
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
        modals.delete(id)
        ac.abort()
    }, 100)

    function register() {
        dependents++
        modals.set(id, popover)
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
    }, { abort: ac.signal })

    onChange(isOpen, (isOpen) => {
        if (isOpen) onOpenModal(popover)
        else onCloseModal(popover)
    }, { abort: ac.signal })

    onChange(status, (status) => {
        if (status === 'opening') onOpeningModal(popover)
        else if (status === 'opened') onOpenedModal(popover)
        else if (status === 'closing') onClosingModal(popover)
        else if (status === 'closed') onClosedModal(popover)
    }, { abort: ac.signal })

    return popover
}
