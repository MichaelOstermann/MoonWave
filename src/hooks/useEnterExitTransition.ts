import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'

type Status = 'closed' | 'opened' | 'opening' | 'closing'
type State = {
    status: Status
    closed: boolean
    opened: boolean
    opening: boolean
    closing: boolean
    enter: boolean
    exit: boolean
    visible: boolean
}

export function useEnterExitTransition(isOpen: boolean): [State, ComponentProps<any>] {
    const [status, setStatus] = useState<Status>(isOpen ? 'opened' : 'closed')
    const closedOrClosing = ['closed', 'closing'].includes(status)
    const openedOrOpening = ['opened', 'opening'].includes(status)

    useEffect(() => {
        if (isOpen && closedOrClosing) setStatus('opening')
        if (!isOpen && openedOrOpening) setStatus('closing')
    }, [isOpen, closedOrClosing, openedOrOpening])

    const state: State = {
        status,
        closed: status === 'closed',
        opened: status === 'opened',
        opening: status === 'opening',
        closing: status === 'closing',
        enter: openedOrOpening,
        exit: closedOrClosing,
        visible: isOpen || status !== 'closed',
    }

    const props: ComponentProps<any> = {
        onTransitionEnd: () => {
            if (status === 'opening') setStatus('opened')
            if (status === 'closing') setStatus('closed')
        },
    }

    return [state, props]
}
