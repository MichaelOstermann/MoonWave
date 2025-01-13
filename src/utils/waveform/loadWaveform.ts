import type { Track } from '@app/types'
import { join, tempDir } from '@tauri-apps/api/path'
import { BaseDirectory } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'
import { pipeInto } from 'ts-functional-pipe'
import { readJSON } from '../fs/readJSON'
import { readText } from '../fs/readText'
import { removeFile } from '../fs/removeFile'
import { writeJSON } from '../fs/writeJSON'

export async function loadWaveform(track: Track): Promise<number[]> {
    return pipeInto(
        await loadPeaks(track).catch(() => []),
        toLinearPeaks,
        normalizePeaks,
    )
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
            removeFile(tmpPath)
            writeJSON(path, peaks, { baseDir: BaseDirectory.AppData })
            return peaks
        })
}

function parsePeaks(value: string): number[] {
    return value
        .split('\n')
        .filter(line => line.startsWith('lavfi.astats.Overall.Peak_level'))
        .map(parsePeak)
}

function parsePeak(value: string): number {
    return pipeInto(
        value,
        v => v.split('=').at(1)!,
        v => v.endsWith('inf') ? 0 : Number.parseFloat(v),
    )
}

function toLinearPeaks(peaks: number[]): number[] {
    return peaks.map(peak => peak === 0 ? 0 : 10 ** (peak / 20))
}

function normalizePeaks(peaks: number[]): number[] {
    const maxPeak = peaks.reduce((maxPeak, peak) => Math.max(maxPeak, Math.abs(peak)), 0)
    const upscale = 1 / maxPeak
    if (!Number.isFinite(upscale)) return peaks
    return peaks.map(peak => peak * upscale)
}
