import type { ReactNode } from "react"
import { Sections } from "../Sections"
import { ColorView } from "./ColorView"
import { DetailsView } from "./DetailsView"
import { IconView } from "./IconView"

export function PlaylistView(): ReactNode {
    return (
        <Sections>
            <ColorView />
            <IconView />
            <DetailsView />
        </Sections>
    )
}
