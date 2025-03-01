import { bootstrap } from './actions/bootstrap'
import { Main } from './components/Main/Main'
import { Sidebar } from './components/Sidebar/Sidebar'

import.meta.glob('./effects/*.ts', { eager: true })

bootstrap()

export function App() {
    return (
        <div
            className="app fixed inset-0 flex overflow-hidden"
            onContextMenu={evt => evt.preventDefault()}
        >
            <Sidebar />
            <Main />
        </div>
    )
}
