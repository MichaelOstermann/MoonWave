export function sleep(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.max(duration, 0)))
}
