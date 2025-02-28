import { useRef } from 'react'

export function useWhile<T>(value: T, use: boolean): T {
    const ref = useRef<T>(value)
    // eslint-disable-next-line react-compiler/react-compiler
    return use ? (ref.current = value) : ref.current
}
