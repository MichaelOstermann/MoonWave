import { Fs } from "#features/Fs"

export async function removeWaveforms(trackIds: string[]): Promise<void> {
    await Fs.removeFiles(trackIds.map((tid) => {
        return `${Fs.$dataDir()}/waveforms/${tid}.json`
    }))
}
