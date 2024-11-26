export function roundByDPR(value: number): number {
    const dpr = window.devicePixelRatio || 1
    return Math.round(value * dpr) / dpr
}
