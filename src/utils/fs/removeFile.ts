import type { RemoveOptions } from '@tauri-apps/plugin-fs'
import { remove } from '@tauri-apps/plugin-fs'

export async function removeFile(path: string, opts?: RemoveOptions): Promise<void> {
    await remove(path, opts).catch(() => {})
}
