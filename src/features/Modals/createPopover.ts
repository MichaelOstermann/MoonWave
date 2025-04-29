import type { ModalPlacementOption } from "@monstermann/signals-modal"
import { flow, Rect } from "@monstermann/fn"
import { createModal, withAnchorElement, withAnchorMeasurement, withBoundary, withFloatingElement, withFloatingMeasurement, withModalGroups, withModalStatus, withPlacement, withPosition } from "@monstermann/signals-modal"

export type Popover = ReturnType<typeof createPopover>

export function createPopover(opts: {
    key: string
    placement?: ModalPlacementOption
}) {
    return createModal(opts.key, () => {
        const $groups = withModalGroups(["popover"])
        const { $isOpen, $status, close, open } = withModalStatus()
        const $anchorElement = withAnchorElement()
        const $floatingElement = withFloatingElement()
        const $anchorMeasurement = withAnchorMeasurement({
            $anchorElement,
            $status,
            transform: flow(
                Rect.expandX(18),
                Rect.expandY(4),
            ),
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
            placement: opts.placement || "horizontal-down",
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
