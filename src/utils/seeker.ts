import type { ReadonlySignal, WritableSignal } from '@monstermann/signals'
import { $mouseX, computed, effect, signal } from '@monstermann/signals'
import { pipe } from './data/pipe'

type Position = {
    relX: number
    absX: number
    diffX: number
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
    $element: WritableSignal<T | null>
    $enabled: WritableSignal<boolean>
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
    const $seeking = computed(() => $dragging() || $hovering())

    const $bounds = signal<DOMRect>(undefined)
    const $left = computed(() => $bounds()?.left ?? 0)
    const $width = computed(() => $bounds()?.width ?? 0)

    const $startX = signal(0)
    const $absX = computed(() => $seeking() ? $mouseX() : 0)
    const $relX = computed(() => pipe(
        $absX(),
        x => x - $left(),
        x => x / $width(),
        x => Math.min(x, 1),
        x => Math.max(x, 0),
    ))

    const getPosition = function (): Position {
        return {
            absX: $absX.peek(),
            relX: $relX.peek(),
            diffX: $startX.peek() - $mouseX.peek(),
        }
    }

    const onElementMouseDown = function (evt: MouseEvent) {
        evt.preventDefault()
        $startX.set($mouseX.peek())
        $bounds.set($element()?.getBoundingClientRect())
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
        $bounds.set($element()?.getBoundingClientRect())
        $hovering.set(true)
    }

    const onElementMouseLeave = function () {
        $hovering.set(false)
    }

    effect(() => {
        $element()?.removeEventListener('pointerdown', onElementMouseDown)

        if ($enabled() && $element())
            $element()?.addEventListener('pointerdown', onElementMouseDown)
        else
            $dragging.set(false)
    })

    effect(() => {
        document.removeEventListener('pointermove', onDocumentMouseMove)
        document.removeEventListener('pointerup', onDocumentMouseUp)

        if ($dragging()) {
            document.addEventListener('pointermove', onDocumentMouseMove, { passive: true })
            document.addEventListener('pointerup', onDocumentMouseUp)
        }
    })

    effect(() => {
        $element()?.removeEventListener('pointerenter', onElementMouseEnter)
        $element()?.removeEventListener('pointerleave', onElementMouseLeave)

        if (opts.useHoverPreview && $enabled() && $element()) {
            $element()?.addEventListener('pointerenter', onElementMouseEnter)
            $element()?.addEventListener('pointerleave', onElementMouseLeave)
        }
        else {
            $hovering.set(false)
        }
    })

    effect(() => {
        if (!opts.cursor) return
        if ($dragging())
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
