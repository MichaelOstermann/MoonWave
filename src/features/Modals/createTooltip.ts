import { Rect } from "@monstermann/fn"
import { createModal, withAnchorElement, withAnchorMeasurement, withBoundary, withCloseOnScroll, withFloatingElement, withFloatingMeasurement, withModalGroups, withModalStatus, withPlacement, withPosition } from "@monstermann/signals-modal"

export type Tooltip = ReturnType<typeof createTooltip>

export function createTooltip(key: string) {
    return createModal(key, () => {
        const $groups = withModalGroups(["tooltip"])
        const { $isOpen, $status, close, open } = withModalStatus()
        const $anchorElement = withAnchorElement()
        const $floatingElement = withFloatingElement()
        withCloseOnScroll({ $anchorElement, $status })
        const $anchorMeasurement = withAnchorMeasurement({
            $anchorElement,
            $status,
            transform: rect => Rect.expandX(rect, 18),
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
            placement: "down-center",
        })
        const $position = withPosition({
            $anchorMeasurement,
            $boundary,
            $floatingMeasurement,
            $placement,
        })
        return {
            $anchorElement,
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
