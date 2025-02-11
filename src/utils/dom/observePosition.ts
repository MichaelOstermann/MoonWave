import { shallowEqualObjects } from 'shallow-equal'

// Reference: https://github.com/floating-ui/floating-ui/blob/master/packages/dom/src/autoUpdate.ts
export function observePosition(
    element: HTMLElement,
    onMove: (rect: DOMRectReadOnly) => void,
): () => void {
    let io: IntersectionObserver | null = null
    let tid: Timer

    function cleanup() {
        clearTimeout(tid)
        io?.disconnect()
        io = null
    }

    function refresh(skip = false, threshold = 1) {
        const elementRect = element.getBoundingClientRect()
        const { left, top, width, height } = elementRect

        if (!skip) {
            onMove(elementRect)
        }

        if (!width || !height) {
            return
        }

        const insetTop = Math.floor(top)
        const insetRight = Math.floor(window.innerWidth - (left + width))
        const insetBottom = Math.floor(window.innerHeight - (top + height))
        const insetLeft = Math.floor(left)
        const rootMargin = `${-insetTop}px ${-insetRight}px ${-insetBottom}px ${-insetLeft}px`

        let isFirstUpdate = true

        function handleObserve(entries: IntersectionObserverEntry[]) {
            const ratio = entries[0]!.intersectionRatio

            if (ratio !== threshold && !isFirstUpdate)
                return refresh()

            if (ratio !== threshold && ratio === 0)
                tid = setTimeout(() => refresh(false, 1e-7), 1000)

            if (ratio !== threshold && ratio !== 0)
                refresh(false, ratio)

            if (ratio === 1 && !shallowEqualObjects(elementRect, element.getBoundingClientRect()))
                refresh()

            isFirstUpdate = false
        }

        io = new IntersectionObserver(handleObserve, {
            rootMargin,
            threshold: Math.max(0, Math.min(1, threshold)) || 1,
        })

        io.observe(element)
    }

    refresh(true)

    return cleanup
}
