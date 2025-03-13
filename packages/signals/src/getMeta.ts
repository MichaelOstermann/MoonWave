import type { InternalMeta, Meta } from './types'

export function getMeta(options?: {
    name?: string
    meta?: InternalMeta
}): Meta {
    return {
        name: options?.name || options?.meta?.name || 'Anonymous',
        path: options?.meta?.path || '',
        line: options?.meta?.line ?? -1,
    }
}
