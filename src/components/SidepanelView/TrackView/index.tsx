import type { ReactNode } from "react"
import { Sections } from "../Sections"
import { DetailsView } from "./DetailsView"
import { TagsView } from "./TagsView"

export function TrackView(): ReactNode {
    return (
        <Sections>
            <TagsView />
            <DetailsView />
        </Sections>
    )
}
