import type { View } from "../Views"

export type SidebarItem =
    | View
    | { name: "SECTION", value: string }
