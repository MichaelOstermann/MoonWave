import type { Memo, Signal } from "@monstermann/signals"
import { App } from "#features/App"
import { pipe } from "@monstermann/fn"
import { effect, memo, peek, signal } from "@monstermann/signals"
import { $pointerX } from "@monstermann/signals-web"

type Position = {
    absX: number
    diffX: number
    relX: number
}

type SeekerOptions = {
    cursor?: string
    disabled?: boolean
    useHoverPreview?: boolean
    onSeek?: (pos: Position) => void
    onSeekEnd?: (pos: Position) => void
    onSeekStart?: (pos: Position) => void
}

interface Seeker<T extends Element> {
    $absX: Memo<number>
    $dragging: Signal<boolean>
    $element: Signal<T | null>
    $enabled: Signal<boolean>
    $hovering: Signal<boolean>
    $relX: Memo<number>
}

export function createSeeker<T extends HTMLElement>(opts: SeekerOptions): Seeker<T> {
    const $element = signal<T>(null)
    const $dragging = signal(false)
    const $hovering = signal(false)
    const $enabled = signal(opts.disabled !== false)

    const $bounds = signal<DOMRect>(undefined)
    const $left = memo(() => $bounds()?.left ?? 0)
    const $width = memo(() => $bounds()?.width ?? 0)

    const $startX = signal(0)
    const $absX = memo(() => $hovering() || $dragging() ? $pointerX() : 0)
    const $relX = memo(() => pipe(
        $absX(),
        x => x - $left(),
        x => x / $width(),
        x => Math.min(x, 1),
        x => Math.max(x, 0),
    ))

    const getPosition = function (): Position {
        return {
            absX: peek($absX),
            diffX: peek($startX) - peek($pointerX),
            relX: peek($relX),
        }
    }

    const onElementMouseDown = function (evt: MouseEvent) {
        evt.preventDefault()
        $startX(peek($pointerX))
        $bounds($element()?.getBoundingClientRect())
        $dragging(true)
        opts.onSeekStart?.(getPosition())
    }

    const onDocumentMouseMove = function () {
        opts.onSeek?.(getPosition())
    }

    const onDocumentMouseUp = function () {
        opts.onSeekEnd?.(getPosition())
        $dragging(false)
    }

    const onElementMouseEnter = function () {
        $bounds($element()?.getBoundingClientRect())
        $hovering(true)
    }

    const onElementMouseMove = function () {
        $hovering(true)
    }

    const onElementMouseLeave = function () {
        $hovering(false)
    }

    effect(() => {
        if (!$hovering()) return
        if (!App.$isFocused()) onElementMouseLeave()
    })

    effect(() => {
        const ac = new AbortController()

        if ($enabled() && $element())
            $element()?.addEventListener("pointerdown", onElementMouseDown, { signal: ac.signal })
        else
            $dragging(false)

        return () => ac.abort()
    })

    effect(() => {
        if (!$dragging()) return
        const ac = new AbortController()
        document.addEventListener("pointermove", onDocumentMouseMove, { passive: true, signal: ac.signal })
        document.addEventListener("pointerup", onDocumentMouseUp, { signal: ac.signal })
        return () => ac.abort()
    })

    effect(() => {
        const ac = new AbortController()

        if (opts.useHoverPreview && $enabled() && $element()) {
            $element()?.addEventListener("pointerenter", onElementMouseEnter, { signal: ac.signal })
            $element()?.addEventListener("pointermove", onElementMouseMove, { signal: ac.signal })
            $element()?.addEventListener("pointerleave", onElementMouseLeave, { signal: ac.signal })
        }
        else {
            $hovering(false)
        }

        return () => ac.abort()
    })

    effect(() => {
        if (!opts.cursor) return
        if ($dragging())
            document.body.classList.add(opts.cursor)
        else
            document.body.classList.remove(opts.cursor)
    })

    return {
        $absX,
        $dragging,
        $element,
        $enabled,
        $hovering,
        $relX,
    }
}
