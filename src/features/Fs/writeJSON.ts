import type { WriteFileOptions } from "@tauri-apps/plugin-fs"
import { mkdir, writeFile } from "@tauri-apps/plugin-fs"

export async function writeJSON<T>(path: string, data: T, opts?: WriteFileOptions): Promise<void> {
    const buf = new TextEncoder().encode(JSON.stringify(data))

    return writeFile(path, buf, opts)
        .catch(async (err) => {
            if (!err.includes("(os error 2)")) throw err
            const dirPath = path.split("/").slice(0, -1).join("/")
            await mkdir(dirPath, {
                baseDir: opts?.baseDir,
                recursive: true,
            })
            return writeFile(path, buf, opts)
        })
}
