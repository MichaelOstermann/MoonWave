import type { ModalContext } from "@monstermann/signals-modal"
import { useEffect, useRef } from "react"

export function useModal<T extends ModalContext>(setup: () => T): T {
    const modalRef = useRef<T>(null as unknown as T)

    // eslint-disable-next-line react-hooks/refs
    if (!modalRef.current || modalRef.current.isDisposed()) {
        modalRef.current = setup()
    }

    useEffect(() => {
        return () => modalRef.current?.dispose()
    }, [])

    // eslint-disable-next-line react-hooks/refs
    return modalRef.current
}
