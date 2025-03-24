import type { Action, Event, Signal } from './types'
import { onCreateActionCallbacks, onCreateEventCallbacks, onCreateSignalCallbacks } from './internals/events'

type Value =
    | Signal<unknown>
    | Action<unknown>
    | Event<unknown>

type Ref = WeakRef<Value>

const name = 'signals'

if (typeof window !== 'undefined' && !Object.hasOwn(window, name)) {
    let id = 0
    const registry = new Map<number, Ref>()
    const finalizationRegistry = new FinalizationRegistry<number>(key => registry.delete(key))

    const register = function (value: Value): void {
        if (value.meta.internal) return
        const key = id++
        const ref = new WeakRef(value)
        registry.set(key, ref)
        finalizationRegistry.register(value, key, ref)
    }

    onCreateActionCallbacks.add(register)
    onCreateEventCallbacks.add(register)
    onCreateSignalCallbacks.add(register)

    Object.defineProperty(window, name, {
        configurable: true,
        get: () => {
            return Array.from(registry.keys()).reduce((result, key) => {
                const ref = registry.get(key)
                if (!ref) return result
                const value = ref.deref()
                if (!value) {
                    registry.delete(key)
                    finalizationRegistry.unregister(ref)
                    return result
                }
                const meta = value.meta
                const name = meta.name.replace(/^\$|\$$/g, '')
                const path = meta.path.split('/').filter(Boolean)
                if (name !== path.at(-1)) path.push(name)
                return setPath(result, path, value)
            }, {})
        },
    })
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
