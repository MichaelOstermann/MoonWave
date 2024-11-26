import { $config } from '@app/state/state'
import { audioDir } from '@tauri-apps/api/path'

const audioPath = audioDir()

export async function getLibraryPath(): Promise<string> {
    return $config.value.libraryPath || await audioPath
}
