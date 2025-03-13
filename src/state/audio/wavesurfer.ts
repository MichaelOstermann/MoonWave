import type WaveSurfer from 'wavesurfer.js'
import { effect, signal } from '@monstermann/signals'
import { $currentTrackPosition } from './currentTrackPosition'

export const $wavesurfer = signal<WaveSurfer>(null)

effect(() => $wavesurfer()?.setTime($currentTrackPosition()))
