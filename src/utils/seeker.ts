import type { ReadonlySignal } from './signals/computed'
import type { Signal } from './signals/signal'
import { $mouseX } from '@app/state/state'
import { pipe } from './data/pipe'
import { computed } from './signals/computed'
import { effect } from './signals/effect'
import { signal } from './signals/signal'

type Position = {
    relX: number
    absX: number
}

type SeekerOptions = {
    disabled?: boolean
    cursor?: string
    useHoverPreview?: boolean
    onSeekStart?: (pos: Position) => void
    onSeek?: (pos: Position) => void
    onSeekEnd?: (pos: Position) => void
}

interface Seeker<T extends Element> {
    $element: Signal<T | null>
    $enabled: Signal<boolean>
    $relX: ReadonlySignal<number>
    $absX: ReadonlySignal<number>
    $dragging: ReadonlySignal<boolean>
    $hovering: ReadonlySignal<boolean>
    $seeking: ReadonlySignal<boolean>
}

export function createSeeker<T extends HTMLElement>(opts: SeekerOptions): Seeker<T> {
    const $element = signal<T>(null)
    const $dragging = signal(false)
    const $hovering = signal(false)
    const $enabled = signal(opts.disabled !== false)
    const $seeking = computed(() => $dragging.value || $hovering.value)

    const $bounds = signal<DOMRect>(undefined)
    const $left = computed(() => $bounds.value?.left ?? 0)
    const $width = computed(() => $bounds.value?.width ?? 0)

    const $absX = computed(() => $seeking.value ? $mouseX.value : 0)
    const $relX = computed(() => pipe(
        $absX.value,
        x => x - $left.value,
        x => x / $width.value,
        x => Math.min(x, 1),
        x => Math.max(x, 0),
    ))

    const getPosition = function (): Position {
        return { absX: $absX.peek(), relX: $relX.peek() }
    }

    const onElementMouseDown = function () {
        $bounds.set($element.value?.getBoundingClientRect())
        $dragging.set(true)
        opts.onSeekStart?.(getPosition())
    }

    const onDocumentMouseMove = function () {
        opts.onSeek?.(getPosition())
    }

    const onDocumentMouseUp = function () {
        opts.onSeekEnd?.(getPosition())
        $dragging.set(false)
    }

    const onElementMouseEnter = function () {
        $bounds.set($element.value?.getBoundingClientRect())
        $hovering.set(true)
    }

    const onElementMouseLeave = function () {
        $hovering.set(false)
    }

    effect(() => {
        $element.value?.removeEventListener('pointerdown', onElementMouseDown)

        if ($enabled.value && $element.value)
            $element.value?.addEventListener('pointerdown', onElementMouseDown)
        else
            $dragging.set(false)
    })

    effect(() => {
        document.removeEventListener('pointermove', onDocumentMouseMove)
        document.removeEventListener('pointerup', onDocumentMouseUp)

        if ($dragging.value) {
            document.addEventListener('pointermove', onDocumentMouseMove, { passive: true })
            document.addEventListener('pointerup', onDocumentMouseUp)
        }
    })

    effect(() => {
        $element.value?.removeEventListener('pointerenter', onElementMouseEnter)
        $element.value?.removeEventListener('pointerleave', onElementMouseLeave)

        if (opts.useHoverPreview && $enabled.value && $element.value) {
            $element.value?.addEventListener('pointerenter', onElementMouseEnter)
            $element.value?.addEventListener('pointerleave', onElementMouseLeave)
        }
        else {
            $hovering.set(false)
        }
    })

    effect(() => {
        if (!opts.cursor) return
        if ($dragging.value)
            document.body.classList.add(opts.cursor)
        else
            document.body.classList.remove(opts.cursor)
    })

    return {
        $element,
        $enabled,
        $relX,
        $absX,
        $dragging,
        $hovering,
        $seeking,
    }
}
