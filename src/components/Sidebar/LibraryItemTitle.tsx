import { type ReactNode, useState } from 'react'
import { twJoin } from 'tailwind-merge'

interface LibraryItemTitleProps {
    title: string
    isEditing?: boolean
    onSubmit?: (title: string) => void
}

export function LibraryItemTitle({
    title,
    isEditing,
    onSubmit,
}: LibraryItemTitleProps): ReactNode {
    return (
        <div className="flex shrink grow">
            {!isEditing && (
                <span
                    className={twJoin(
                        'truncate',
                        'group-data-[active=true]:text-[--fg-accent]',
                        'group-data-[border=true]:text-[--fg-accent]',
                        'group-data-[playing=true]:text-[--fg-accent]',
                    )}
                >
                    {title}
                </span>
            )}
            {isEditing && (
                <EditingTitle
                    title={title}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    )
}

function EditingTitle({
    title,
    onSubmit,
}: LibraryItemTitleProps): ReactNode {
    const [initialTitle] = useState(title)
    const [newTitle, setNewTitle] = useState(title)

    return (
        <input
            autoFocus
            type="text"
            value={newTitle}
            placeholder="New Playlist"
            className="shrink grow border-0 bg-transparent text-[--fg-accent] outline-none placeholder:text-[--fg-soft]"
            onClick={evt => evt.stopPropagation()}
            onChange={evt => setNewTitle(evt.target.value)}
            onKeyDown={(evt) => {
                const target = evt.target as HTMLInputElement

                if (evt.key === 'Escape' && newTitle !== initialTitle)
                    setNewTitle(initialTitle)
                else if (evt.key === 'Escape')
                    target.blur()
                else if (evt.key === 'Enter')
                    target.blur()
            }}
            onBlur={() => onSubmit?.(newTitle)}
        />
    )
}
