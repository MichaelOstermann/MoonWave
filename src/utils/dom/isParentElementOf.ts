export function isParentElementOf(parent: Element, child: Element): boolean {
    let pivot: Element | null = child
    while (pivot) {
        pivot = pivot.parentElement
        if (pivot === parent) return true
    }
    return false
}
