import type { ReactNode } from "react"
import { saveTags } from "#actions/tags/saveTags"
import { FadeInOut } from "#components/FadeInOut"
import { Tags } from "#features/Tags"
import { LucideSave } from "lucide-react"

export function SaveButton(): ReactNode {
    const isSavingTags = Tags.$isSaving()
    const hasChanges = Tags.$hasEdited()

    return (
        <FadeInOut
            show={hasChanges && !isSavingTags}
            onClick={function () {
                if (isSavingTags) return
                saveTags()
            }}
        >
            <button
                className="flex size-7 cursor-default items-center justify-center rounded-md bg-(--bg-blue) text-xs font-medium text-(--fg-blue)"
                type="button"
            >
                <LucideSave className="size-4" />
            </button>
        </FadeInOut>
    )
}
