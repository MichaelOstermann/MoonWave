export type View =
    | { name: "LIBRARY" }
    | { name: "RECENTLY_ADDED" }
    | { name: "UNSORTED" }
    | { name: "PLAYLIST", value: string }

export type FocusedView =
    | "MAIN"
    | "SIDEBAR"
