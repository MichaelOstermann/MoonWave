import type { Action, Effect, Event, Signal } from '../types'

export const onCreateActionCallbacks = new Set<(action: Action<unknown, unknown>) => void>()
export const onCreateEffectCallbacks = new Set<(effect: Effect) => void>()
export const onCreateEventCallbacks = new Set<(event: Event<unknown>) => void>()
export const onCreateSignalCallbacks = new Set<(signal: Signal<unknown>) => void>()
