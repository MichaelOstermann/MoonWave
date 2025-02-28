type Canvas = {
    canvas: OffscreenCanvas
    context: OffscreenCanvasRenderingContext2D
    cache: Map<string, number>
}

const canvases = new Map<string, Canvas>()

export function measureText(text: string | number, opts: {
    fontSize: string
    fontWeight: string
    fontFamily: string
    monospace?: boolean
}): number {
    return opts.monospace
        ? measureMonospace(String(text), opts)
        : measureRegular(String(text), opts)
}

function measureRegular(text: string, opts: {
    fontSize: string
    fontWeight: string
    fontFamily: string
}): number {
    const { context, cache } = getCanvas(opts)
    if (cache.has(text)) return cache.get(text)!
    const value = Math.ceil(context.measureText(text).width)
    cache.set(text, value)
    return value
}

function measureMonospace(text: string, opts: {
    fontSize: string
    fontWeight: string
    fontFamily: string
}): number {
    const { cache } = getCanvas(opts)
    if (cache.has(text)) return cache.get(text)!

    const chars = new Set(text)
    let charWidth = 0
    let charCount = 0

    for (const char of chars) {
        charCount++
        charWidth = Math.max(charWidth, measureRegular(char, opts))
    }

    const value = charWidth * charCount
    cache.set(text, value)
    return value
}

function getCanvas(opts: {
    fontSize: string
    fontWeight: string
    fontFamily: string
}) {
    const font = `${opts.fontWeight} ${opts.fontSize} ${opts.fontFamily}`

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
