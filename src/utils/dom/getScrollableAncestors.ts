import { isOverflowElement } from './isOverflowElement'

export function getScrollableAncestors(element: Element): Element[] {
    const scrollableAncestors: Element[] = []
    let pivot = element.parentElement

    while (pivot) {
        if (isOverflowElement(pivot))
            scrollableAncestors.push(pivot)
        pivot = pivot.parentElement
    }

    return scrollableAncestors
}
