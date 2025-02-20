function isOverflowElement(element: Element): boolean {
    const { overflow, overflowX, overflowY, display } = getComputedStyle(element)
    return (
        /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX)
        && !['inline', 'contents'].includes(display)
    )
}

export function onAncestorScroll(
    element: HTMLElement,
    onScroll: () => void,
): () => void {
    const overflowElements = new Set<Element>()
    let pivot: Element | null = element

    // eslint-disable-next-line no-cond-assign
    while (pivot = pivot?.parentElement) {
        if (!isOverflowElement(pivot)) continue
        overflowElements.add(pivot)
        pivot.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
        for (const element of overflowElements)
            element.removeEventListener('scroll', onScroll)
    }
}
