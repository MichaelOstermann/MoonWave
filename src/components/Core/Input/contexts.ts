import type { UseInput } from './useInput'
import { createContext } from 'react'

export const InputContext = createContext<UseInput>({
    props: {},
    input: null,
})
