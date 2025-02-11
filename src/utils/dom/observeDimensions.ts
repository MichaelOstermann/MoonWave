const observers = new WeakMap<Element, Set<(rect: DOMRectReadOnly) => void>>()

const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const callbacks = observers.get(entry.target) ?? []
        for (const cb of callbacks) cb(entry.contentRect)
    }
})

export function observeDimensions(
    element: HTMLElement,
    onResize: (rect: DOMRectReadOnly) => void,
): () => void {
    const callbacks = observers.get(element) ?? new Set()
    callbacks.add(onResize)
    observers.set(element, callbacks)
    ro.observe(element)
    return () => {
        const callbacks = observers.get(element)
        callbacks?.delete(onResize)
        if (callbacks && callbacks.size > 0) return
        ro.unobserve(element)
    }
}
