type Canvas = {
    canvas: OffscreenCanvas
    context: OffscreenCanvasRenderingContext2D
    cache: Map<string, number>
}

const canvases = new Map<string, Canvas>()

export function measureText(text: string, opts: {
    font: string
    monospace?: boolean
}): number {
    return opts.monospace
        ? measureMonospace(text, opts.font)
        : measureRegular(text, opts.font)
}

function measureRegular(text: string, font: string): number {
    const { context, cache } = getCanvas(font)
    if (cache.has(text)) return cache.get(text)!
    const value = Math.ceil(context.measureText(text).width)
    cache.set(text, value)
    return value
}

function measureMonospace(text: string, font: string): number {
    const { cache } = getCanvas(font)
    if (cache.has(text)) return cache.get(text)!

    const chars = [...text]
    const uniqueChars = new Set(text)
    let charWidth = 0

    for (const char of uniqueChars) {
        charWidth = Math.max(charWidth, measureRegular(char, font))
    }

    const value = charWidth * chars.length
    cache.set(text, value)
    return value
}

function getCanvas(font: string) {
    if (!canvases.has(font)) {
        const canvas = new OffscreenCanvas(0, 0)
        const context = canvas.getContext('2d')!
        context.font = font
        const entry: Canvas = {
            canvas,
            context,
            cache: new Map(),
        }
        canvases.set(font, entry)
        return entry
    }

    return canvases.get(font)!
}
