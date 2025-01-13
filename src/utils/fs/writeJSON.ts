import { mkdir, rename, writeFile, type WriteFileOptions } from '@tauri-apps/plugin-fs'

export async function writeJSON<T>(path: string, data: T, opts?: WriteFileOptions): Promise<void> {
    const buf = new TextEncoder().encode(JSON.stringify(data))
    const tmpPath = `${path}.tmp`
    const dirPath = path.split('/').slice(0, -1).join('/')

    return writeFile(tmpPath, buf, opts)
        .catch(async (err) => {
            if (!err.includes('No such file or directory')) throw err
            await mkdir(dirPath, {
                recursive: true,
                baseDir: opts?.baseDir,
            })
            return writeFile(tmpPath, buf, opts)
        })
        .then(() => rename(tmpPath, path, {
            oldPathBaseDir: opts?.baseDir,
            newPathBaseDir: opts?.baseDir,
        }))
}
