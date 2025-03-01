import type { Action } from './action'
import type { ReadonlySignal } from './computed'
import type { Event } from './event'
import type { Meta } from './types'

let id = 0

const signals = new Map<number, WeakRef<ReadonlySignal<any>>>()
const signalsRegistry = new FinalizationRegistry<number>(key => signals.delete(key))

const actions = new Map<number, WeakRef<Action<any>>>()
const actionsRegistry = new FinalizationRegistry<number>(key => actions.delete(key))

const events = new Map<number, WeakRef<Event<any>>>()
const eventsRegistry = new FinalizationRegistry<number>(key => events.delete(key))

export function registerSignal(signal: ReadonlySignal<any>): void {
    const key = id++
    const ref = new WeakRef(signal)
    signals.set(key, ref)
    signalsRegistry.register(signal, key, ref)
}

export function registerAction(action: Action<any>): void {
    const key = id++
    const ref = new WeakRef(action)
    actions.set(key, ref)
    actionsRegistry.register(action, key, ref)
}

export function registerEvent(event: Event<any>): void {
    const key = id++
    const ref = new WeakRef(event)
    events.set(key, ref)
    eventsRegistry.register(event, key, ref)
}

Object.defineProperty(window, 'signals', { configurable: true, get: () => registryToRecord(signalsRegistry, signals) })
Object.defineProperty(window, 'actions', { configurable: true, get: () => registryToRecord(actionsRegistry, actions) })
Object.defineProperty(window, 'events', { configurable: true, get: () => registryToRecord(eventsRegistry, events) })

function registryToRecord<T extends { meta: Meta }>(registry: FinalizationRegistry<number>, map: Map<number, WeakRef<T>>): Record<string, T> {
    return Array.from(map.keys()).reduce((result, key) => {
        const ref = map.get(key)
        if (!ref) return result
        const value = ref.deref()
        if (!value) {
            map.delete(key)
            registry.unregister(ref)
            return result
        }
        const meta = value.meta
        const path = meta.path.split('/').filter(Boolean)
        if (meta.name !== path.at(-1)) path.push(meta.name)
        return setPath(result, path, value)
    }, {})
}

function setPath(target: Record<any, any>, path: string[], value: any): Record<any, any> {
    let pivot = target
    while (true) {
        const key = path.shift()
        if (!key) return target
        if (!path.length) pivot[key] = value
        else pivot = (pivot[key] ??= {})
    }
    return target
}
