import { getScrollableAncestors } from './getScrollableAncestors'

export function onAncestorScroll(
    element: HTMLElement,
    onScroll: () => void,
): () => void {
    const overflowElements = getScrollableAncestors(element)

    for (const element of overflowElements)
        element.addEventListener('scroll', onScroll, { passive: true })

    return () => {
        for (const element of overflowElements)
            element.removeEventListener('scroll', onScroll)
    }
}
