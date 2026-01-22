import { Rect } from "@monstermann/fn"
import { createModal, withBoundary, withFloatingElement, withFloatingMeasurement, withModalGroups, withModalStatus, withMouseAnchor, withPlacement, withPosition } from "@monstermann/signals-modal"

export type ContextMenu = ReturnType<typeof createContextMenu>

export function createContextMenu(opts: { key: string }) {
    return createModal(opts.key, () => {
        const $groups = withModalGroups(["popover"])
        const { $isOpen, $status, close, open } = withModalStatus()
        const $floatingElement = withFloatingElement()
        const $anchorMeasurement = withMouseAnchor({
            $status,
        })
        const $floatingMeasurement = withFloatingMeasurement({
            $floatingElement,
            $status,
        })
        const $boundary = withBoundary({
            $status,
            transform: rect => Rect.shrink(rect, 10),
        })
        const $placement = withPlacement({
            $anchorMeasurement,
            $boundary,
            $floatingMeasurement,
            placement: "vertical-center",
        })
        const $position = withPosition({
            $anchorMeasurement,
            $boundary,
            $floatingMeasurement,
            $placement,
            transform(rect) {
                const placement = $placement()
                if (placement.startsWith("down")) return Rect.translateY(rect, 14)
                if (placement.startsWith("up")) return Rect.translateY(rect, -4)
                return rect
            },
        })

        return {
            $floatingElement,
            $groups,
            $isOpen,
            $position,
            $status,
            close,
            open,
        }
    })
}
