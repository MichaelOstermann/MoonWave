import { BaseDirectory } from '@tauri-apps/plugin-fs'
import { removeFile } from '../fs/removeFile'

export async function deleteWaveforms(trackIds: string[]): Promise<void> {
    for (const trackId of trackIds) {
        await removeFile(`waveforms/${trackId}.json`, { baseDir: BaseDirectory.AppData })
    }
}
