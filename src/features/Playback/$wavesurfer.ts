import type WaveSurfer from "wavesurfer.js"
import { effect, signal } from "@monstermann/signals"
import { Playback } from "."

export const $wavesurfer = signal<WaveSurfer>(null)

effect(() => $wavesurfer()?.setTime(Playback.$position()))
