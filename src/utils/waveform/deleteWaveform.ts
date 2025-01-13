import { BaseDirectory } from '@tauri-apps/plugin-fs'
import { removeFile } from '../fs/removeFile'

export async function deleteWaveform(trackId: string): Promise<void> {
    return removeFile(`waveforms/${trackId}.json`, { baseDir: BaseDirectory.AppData })
}
