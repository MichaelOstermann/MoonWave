import type { Track } from '@app/types'
import { join, tempDir } from '@tauri-apps/api/path'
import { BaseDirectory } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'
import { pipe } from '../data/pipe'
import { readJSON } from '../fs/readJSON'
import { readText } from '../fs/readText'
import { removeFile } from '../fs/removeFile'
import { writeJSON } from '../fs/writeJSON'

export async function loadWaveform(track: Track): Promise<number[]> {
    return loadPeaks(track).catch(() => [])
}

async function loadPeaks(track: Track): Promise<number[]> {
    const path = `waveforms/${track.id}.json`

    const peaks = await readJSON<number[]>(path, { baseDir: BaseDirectory.AppData })
    if (peaks) return peaks

    const tmpPath = await join(await tempDir(), track.id)

    return Command
        .sidecar('bin/ffmpeg', ['-i', track.path, '-af', `aresample=44100,asetnsamples=4000,astats=reset=1:metadata=1,ametadata=print:key='lavfi.astats.Overall.Peak_level':file=${tmpPath}`, '-f', 'null', '-'])
        .execute()
        .then(() => readText(tmpPath))
        .then(parsePeaks)
        .then((peaks) => {
            if (peaks.length)
                writeJSON(path, peaks, { baseDir: BaseDirectory.AppData })
            return peaks
        })
        .finally(() => removeFile(tmpPath))
}

function parsePeaks(value: string): number[] {
    const peaks = value
        .split('\n')
        .filter(line => line.startsWith('lavfi.astats.Overall.Peak_level'))
        .map(line => line.split('=').at(1)!)
        .map(line => Number.parseFloat(line) || 0)

    return pipe(
        peaks,
        peaks => downsamplePeaks(peaks),
        peaks => logToLinearPeaks(peaks),
        peaks => upscalePeaks(peaks),
        peaks => reducePrecision(peaks),
    )
}

// Downsample peaks for large tracks. It not only helps saving disk space,
// it can also improve the quality of waveforms, making them look less uniform.
function downsamplePeaks(peaks: number[]): number[] {
    const targetSize = 8_000
    const peaksSize = peaks.length

    if (peaksSize <= targetSize) return peaks

    const sampleSize = peaksSize / targetSize
    const result: number[] = Array.from({ length: targetSize })
    const clamp = (n: number) => Math.max(0, Math.min(n, peaksSize))

    for (let i = 0; i < targetSize; i++) {
        let max = 0
        const start = clamp(Math.floor(i * sampleSize))
        const end = clamp(Math.floor((i + 1) * sampleSize))

        for (let j = start; j < end; j++) {
            const n = peaks[j]!
            if (Math.abs(n) > Math.abs(max)) max = n
        }

        result[i] = max
    }

    return result
}

// Translate peak data to a range between -1 and 1.
function logToLinearPeaks(peaks: number[]): number[] {
    return peaks.map(peak => peak === 0 ? 0 : 10 ** (peak / 20))
}

// Reduce the precision of peaks to save disk space, without decreasing the quality of the waveform.
function reducePrecision(peaks: number[]): number[] {
    const precision = 10_000
    return peaks.map(peak => Math.round(peak * precision) / precision)
}

// Apply a virtual gain to make the waveform fill the available height.
function upscalePeaks(peaks: number[]): number[] {
    const maxPeak = peaks.reduce((maxPeak, peak) => Math.max(maxPeak, Math.abs(peak)), 0)
    const upscale = 1 / maxPeak
    if (!Number.isFinite(upscale)) return peaks
    return peaks.map(peak => peak * upscale)
}
