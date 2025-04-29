import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { twJoin } from "tailwind-merge"

interface LibraryItemTitleProps {
    isEditing?: boolean
    title: string
    onSubmit?: (title: string) => void
}

export function LibraryItemTitle({
    isEditing,
    onSubmit,
    title,
}: LibraryItemTitleProps): ReactNode {
    return (
        <div className="flex shrink grow">
            {!isEditing && (
                <span
                    className={twJoin(
                        "truncate",
                        "group-data-[active=true]:text-(--fg-accent)",
                        "group-data-[border=true]:text-(--fg-accent)",
                        "group-data-[playing=true]:text-(--fg-accent)",
                    )}
                >
                    {title}
                </span>
            )}
            {isEditing && (
                <EditingTitle
                    onSubmit={onSubmit}
                    title={title}
                />
            )}
        </div>
    )
}

function EditingTitle({
    onSubmit,
    title,
}: LibraryItemTitleProps): ReactNode {
    const initialTitle = useRef(title)
    const [newTitle, setNewTitle] = useState(title)

    return (
        <input
            autoFocus
            className="shrink grow border-0 bg-transparent text-(--fg-accent) outline-hidden placeholder:text-(--fg-soft)"
            onBlur={() => onSubmit?.(newTitle)}
            onChange={evt => setNewTitle(evt.target.value)}
            onClick={evt => evt.stopPropagation()}
            placeholder="New Playlist"
            type="text"
            value={newTitle}
            onKeyDown={(evt) => {
                const target = evt.target as HTMLInputElement

                if (evt.key === "Escape" && newTitle !== initialTitle.current)
                    setNewTitle(initialTitle.current)
                else if (evt.key === "Escape")
                    target.blur()
                else if (evt.key === "Enter")
                    target.blur()
            }}
        />
    )
}
