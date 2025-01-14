import { bootstrap } from './actions/bootstrap'
import { CommandMenu } from './components/CommandMenu'
import { Main } from './components/Main/Main'
import { Sidebar } from './components/Sidebar/Sidebar'
import './utils/keyboard'

bootstrap()

export function App() {
    return (
        <div
            className="app fixed inset-0 flex overflow-hidden"
            onContextMenu={evt => evt.preventDefault()}
        >
            <CommandMenu />
            <Sidebar />
            <Main />
        </div>
    )
}
