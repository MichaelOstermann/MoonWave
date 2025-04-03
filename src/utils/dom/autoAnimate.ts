import type { CSSProperties } from 'react'
import { easeInOut } from '@app/config/easings'
import { shallowEqualObjects } from 'shallow-equal'

type Style = Partial<CSSProperties>

export async function autoAnimate({
    target,
    filter = () => true,
    movedElementsHint = [],
}: {
    target: Element | null | undefined
    filter?: (element: Element) => boolean
    movedElementsHint?: Element[]
}): Promise<void> {
    let resolve: () => void
    const deferred = new Promise<void>(res => resolve = res)

    if (!target) return Promise.resolve()
    let raf = -1

    // Make a snapshot of elements and their dimensions, so we can figure out what got added, removed,
    // or how things moved around.
    const elementsBefore = Array.from(target.children).filter(filter) as HTMLElement[]
    const measurementsBefore = elementsBefore.reduce((acc, element) => acc.set(element, element.getBoundingClientRect()), new Map<Element, DOMRect>())
    const stylesBefore = elementsBefore.reduce((acc, element) => acc.set(element, getStyle(element)), new Map<Element, Style>())

    const observer = new MutationObserver(async () => {
        observer.disconnect()
        cancelAnimationFrame(raf)

        const elementsAfter = Array.from(target.children).filter(filter) as HTMLElement[]
        const measurementsAfter = elementsAfter.reduce((acc, element) => acc.set(element, element.getBoundingClientRect()), new Map<Element, DOMRect>())
        const stylesAfter = elementsAfter.reduce((acc, element) => acc.set(element, getStyle(element)), new Map<Element, Style>())

        const animations: Animation[] = []
        const onAnimationsDone: (() => void)[] = []

        const addedElements: HTMLElement[] = []
        const removedElements: HTMLElement[] = []
        const movedElements: HTMLElement[] = []
        const remainingElements: HTMLElement[] = []

        // Applying the result as translateY(value) to an element will put it back to where it was.
        const getDeltaY = function (element: HTMLElement): number {
            const before = measurementsBefore.get(element)
            const after = measurementsAfter.get(element)
            if (!before || !after) return 0
            return before.top - after.top
        }

        // Apply styles directly to an element and reset it after everything is done.
        // This is necessary because some animations run after a delay and we get FOUC otherwise.
        const setStyles = function (element: HTMLElement, styles: Style): void {
            for (const key in styles) {
                const k = key as any
                const style = element.style
                const before = style[k] ?? ''
                const after = styles[k] ?? ''
                style[k] = String(after)
                onAnimationsDone.push(() => style[k] = before)
            }
        }

        const animate = function (element: HTMLElement, [fromFrame, toFrame]: [Style, Style], options: KeyframeAnimationOptions): void {
            if (shallowEqualObjects(fromFrame, toFrame)) return
            setStyles(element, fromFrame)
            animations.push(element.animate([fromFrame, toFrame] as Keyframe[], options))
        }

        // Used to reinsert removed elements back into the DOM, at the same position.
        const insertClone = function (element: HTMLElement): HTMLElement {
            const clone = element.cloneNode(true) as HTMLElement
            const measurement = measurementsBefore.get(element)!
            const style = stylesBefore.get(element)!

            measurementsBefore.set(clone, measurement)
            measurementsAfter.set(clone, measurementsAfter.get(clone)!)
            stylesBefore.set(clone, style)
            stylesAfter.set(clone, stylesAfter.get(clone)!)

            Object.assign(clone.style, {
                ...style,
                position: 'fixed',
                pointerEvents: 'none',
                top: `${measurement.top}px`,
                left: `${measurement.left}px`,
                width: `${measurement.width}px`,
            })

            target.appendChild(clone)
            onAnimationsDone.push(() => clone.remove())
            return clone
        }

        const fadeIn = function (element: HTMLElement, duration: number, delay: number): void {
            animate(element, [
                { transform: 'scale(0.9)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 },
            ], { duration, delay, easing: easeInOut, fill: 'forwards' })
        }

        const fadeOut = function (element: HTMLElement, duration: number, delay: number): void {
            animate(element, [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.9)', opacity: 0 },
            ], { duration, delay, easing: easeInOut, fill: 'forwards' })
        }

        const move = function (element: HTMLElement, y: number, duration: number, delay: number): void {
            const styleBefore = stylesBefore.get(element)
            const styleAfter = stylesAfter.get(element)

            animate(element, [
                { ...styleBefore, transform: `translateY(${y}px)` },
                { ...styleAfter, transform: 'translateY(0px)' },
            ], { duration, delay, easing: easeInOut, fill: 'forwards' })
        }

        // Collect added, moved and remaining elements.
        for (let i = 0; i < elementsAfter.length; i++) {
            const element = elementsAfter[i]!
            if (!elementsBefore.includes(element)) addedElements.push(element)
            else if (movedElementsHint.includes(element)) movedElements.push(element)
            else remainingElements.push(element)
        }

        // Collect removed elements.
        for (let i = 0; i < elementsBefore.length; i++) {
            const element = elementsBefore[i]!
            if (elementsAfter.includes(element)) continue
            removedElements.push(element)
        }

        // First get removed elements out of the way, then start moving others in after they have some breathing room.
        const moveDelay = removedElements.length > 0 || movedElements.length > 0 ? 50 : 0
        // Once the moved elements got out of the way a bit, start fading in new elements.
        const fadeInDelay = moveDelay + (remainingElements.length > 0 ? 50 : 0)

        // Execute animations.
        for (const element of removedElements) fadeOut(insertClone(element), 200, 0)
        for (const element of movedElements) fadeOut(insertClone(element), 200, 0)
        for (const element of remainingElements) move(element, getDeltaY(element), 200, moveDelay)
        for (const element of movedElements) fadeIn(element, 200, fadeInDelay)
        for (const element of addedElements) fadeIn(element, 200, fadeInDelay)

        // Wait until all animations finished, reset the styles and do cleanups.
        await Promise.all(animations.map(animation => animation.finished))
        animations.forEach(animation => animation.cancel())
        onAnimationsDone.forEach(cleanup => cleanup())

        resolve()
    })

    observer.observe(target, { childList: true })

    raf = requestAnimationFrame(() => {
        observer.disconnect()
        resolve()
    })

    return deferred
}

function getStyle(element: HTMLElement): Style {
    return {
        paddingLeft: element.style.paddingLeft,
    }
}
