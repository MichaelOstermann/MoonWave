import { CommandMenu } from "#components/CommandMenu"
import { useEffect } from "react"
import { bootstrap } from "./actions/app/bootstrap"
import { Main } from "./components/Main/Main"
import { SidebarView } from "./components/SidebarView"
import "./hotkeys"

import.meta.glob("./effects/*.ts", { eager: true })

export function App() {
    useEffect(() => void bootstrap(), [])
    return (
        <div className="app fixed inset-0 flex overflow-hidden">
            <SidebarView />
            <Main />
            <CommandMenu />
        </div>
    )
}
