import type { ModalStatus, Popover, PopoverOptions } from './types'
import { batch } from '@preact/signals-core'
import debounce from 'debounce'
import { clamp } from '../data/clamp'
import { removeEntry } from '../data/removeEntry'
import { setEntry } from '../data/setEntry'
import { observeDimensions } from '../dom/observeDimensions'
import { observePosition } from '../dom/observePosition'
import { changeEffect } from '../signals/changeEffect'
import { withCleanup } from '../signals/cleanups'
import { computed } from '../signals/computed'
import { effect } from '../signals/effect'
import { event } from '../signals/event'
import { signal } from '../signals/signal'
import { getPopover, modals, onClosedModal, onCloseModal, onClosingModal, onOpenedModal, onOpeningModal, onOpenModal } from './modals'

const windowWidth = signal(window.innerWidth)
const windowHeight = signal(window.innerHeight)
window.addEventListener('resize', () => batch(() => {
    windowWidth.set(window.innerWidth)
    windowHeight.set(window.innerHeight)
}))

export function createPopover(
    id: string,
    options: Partial<PopoverOptions> = {},
): Popover {
    const existing = getPopover(id)
    if (existing) return existing

    let dependents = 0
    const ac = new AbortController()

    const isOpen = signal(false)
    const status = signal<ModalStatus>('closed')

    const offset = signal(options.offset ?? 4)
    const borderWidth = signal(options.borderWidth ?? 1)
    const arrowWidth = signal(options.arrowWidth ?? 18)
    const arrowHeight = signal(options.arrowHeight ?? 10)
    const arrowRadius = signal(options.arrowRadius ?? 3)
    const paddingTop = signal(options.paddingTop ?? 10)
    const paddingLeft = signal(options.paddingLeft ?? 10)
    const paddingRight = signal(options.paddingRight ?? 10)
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
    const maxHeightBelow = computed(() => windowHeight() - anchorBottom() - offset() - arrowHeight() - paddingBottom())
    const maxHeight = computed(() => Math.max(maxHeightAbove(), maxHeightBelow()))
    const placement = computed(() => maxHeightAbove() > maxHeightBelow() ? 'above' : 'below')
    const matchPlacement = (placements: { above: number, below: number }): number => placements[placement()]

    const x = computed(() => clamp(
        anchorCenter() - floatingWidth() / 2,
        paddingLeft(),
        windowWidth() - floatingWidth() - paddingRight(),
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
        modals.map(setEntry(id, popover))
        return () => {
            dependents--
            dispose()
        }
    }

    function open() {
        isOpen.set(true)
    }

    function close() {
        isOpen.set(false)
    }

    effect(() => {
        if (!isOpen()) return

        const anchor = anchorElement()
        const floating = floatingElement()
        if (!anchor || !floating) return

        anchorRect.set(anchor.getBoundingClientRect())
        floatingRect.set(floating.getBoundingClientRect())

        withCleanup(observePosition(anchor, anchorRect.set))
        withCleanup(observeDimensions(floating, floatingRect.set))
    }, { abort: ac.signal })

    changeEffect(isOpen, (isOpen) => {
        if (isOpen) {
            popover.onOpen.emit(popover)
            onOpenModal.emit(popover)
        }
        else {
            popover.onClose.emit(popover)
            onCloseModal.emit(popover)
        }
    }, { abort: ac.signal })

    changeEffect(status, (status) => {
        if (status === 'opening') {
            popover.onOpening.emit(popover)
            onOpeningModal.emit(popover)
        }
        else if (status === 'opened') {
            popover.onOpened.emit(popover)
            onOpenedModal.emit(popover)
        }
        else if (status === 'closing') {
            popover.onClosing.emit(popover)
            onClosingModal.emit(popover)
        }
        else if (status === 'closed') {
            popover.onClosed.emit(popover)
            onClosedModal.emit(popover)
        }
    }, { abort: ac.signal })

    return popover
}
