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
}): number {
    const font = `${opts.fontWeight} ${opts.fontSize} ${opts.fontFamily}`

    if (!canvases.has(font)) {
        const canvas = new OffscreenCanvas(0, 0)
        const context = canvas.getContext('2d')!
        context.font = font
        canvases.set(font, {
            canvas,
            context,
            cache: new Map(),
        })
    }

    const { context, cache } = canvases.get(font)!
    const str = String(text)
    if (cache.has(str)) return cache.get(str)!
    const value = Math.ceil(context.measureText(str).width)
    cache.set(str, value)
    return value
}
