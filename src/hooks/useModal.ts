import type { ModalContext } from "@monstermann/signals-modal"
import { useEffect, useRef, useState } from "react"

export function useModal<T extends ModalContext>(setup: () => T): T {
    const [modal, setModal] = useState(() => setup())
    const setupRef = useRef(setup)

    useEffect(() => {
        setupRef.current = setup
    })

    useEffect(() => {
        if (modal.isDisposed()) setModal(setupRef.current())
        return () => modal.dispose()
    }, [modal])

    return modal
}
