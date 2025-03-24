import type { Meta } from '../types'
import type { InternalMeta } from './types'

export function getMeta(options?: {
    name?: string
    internal?: boolean
    meta?: InternalMeta
}): Meta {
    return {
        name: options?.name || options?.meta?.name || 'Anonymous',
        path: options?.meta?.path || '',
        line: options?.meta?.line ?? -1,
        internal: options?.internal ?? false,
    }
}
