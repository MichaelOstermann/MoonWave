import type { Track } from '@app/types'
import { join, tempDir } from '@tauri-apps/api/path'
import { readTextFile, remove } from '@tauri-apps/plugin-fs'
import { Command } from '@tauri-apps/plugin-shell'
import { LazyStore } from '@tauri-apps/plugin-store'
import { pipeInto } from 'ts-functional-pipe'
import { getTrackPathAbs } from './getTrackPathAbs'

const store = new LazyStore('waveforms.json', {
    autoSave: 5_000,
})

export async function loadWaveform(track: Track): Promise<number[]> {
    return pipeInto(
        await loadPeaks(track),
        toLinearPeaks,
        normalizePeaks,
    )
}

export async function deleteWaveform(trackId: string): Promise<void> {
    await store.delete(trackId)
}

async function loadPeaks(track: Track): Promise<number[]> {
    const peaks = await store.get<number[]>(track.id)
    if (peaks) return peaks

    const tmpPath = await join(await tempDir(), track.id)
    const trackPath = await getTrackPathAbs(track.path)

    await Command
        .sidecar('bin/ffmpeg', ['-i', trackPath, '-af', `aresample=44100,asetnsamples=4000,astats=reset=1:metadata=1,ametadata=print:key='lavfi.astats.Overall.Peak_level':file=${tmpPath}`, '-f', 'null', '-'])
        .execute()

    return readTextFile(tmpPath)
        .then(parsePeaks)
        .then((peaks) => {
            remove(tmpPath)
            store.set(track.id, peaks)
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
