import { confirm } from "@tauri-apps/plugin-dialog"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"

export async function checkForUpdates(): Promise<void> {
    const update = await check()
    if (!update) return
    await update.downloadAndInstall()
    const answer = await confirm("A new version of MoonWave is available, please restart to finish the installation!", {
        cancelLabel: "Cancel",
        kind: "info",
        okLabel: "Restart",
        title: "",
    })
    if (!answer) return
    await relaunch()
}

export function periodicallyCheckForUpdates(): void {
    setTimeout(checkForUpdates, 1000 * 60 * 60 * 3)
}
