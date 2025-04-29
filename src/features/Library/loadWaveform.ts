import type { Track } from "../Tracks"
import { Fs } from "#features/Fs"
import { Promise } from "@monstermann/fn"
import { invoke } from "@tauri-apps/api/core"
import { BaseDirectory } from "@tauri-apps/plugin-fs"

export async function loadWaveform(track: Track): Promise<number[]> {
    return loadPeaks(track).catch(() => [])
}

const pending = new Map<string, Promise<number[]>>()

async function loadPeaks(track: Track): Promise<number[]> {
    if (pending.has(track.id)) return pending.get(track.id)!

    const deferred = Promise.defer<number[]>()
    pending.set(track.id, deferred.promise)

    const path = `waveforms/${track.id}.json`
    const peaks: number[] = await Fs.readJSON<number[]>(path, { baseDir: BaseDirectory.AppData })
        ?? await invoke<number[]>("generate_waveform", { filePath: track.path })
            .then(async (peaks) => {
                if (peaks.length)
                    await Fs.writeJSON(path, peaks, { baseDir: BaseDirectory.AppData })
                return peaks
            })

    deferred.resolve(peaks)
    pending.delete(track.id)

    return peaks
}
