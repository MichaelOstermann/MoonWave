import { LSM } from "#features/LSM"
import { Sidebar } from "#features/Sidebar"
import { Views } from "#features/Views"
import { effect, signal, watch } from "@monstermann/signals"
import { TrackList } from "."

export const $LSM = signal(LSM.createLSM<string>())

effect(() => {
    const selectables = TrackList.$tracks().map(t => t.id)
    $LSM(lsm => LSM.setSelectables(lsm, selectables))
})

watch(Views.$selected, () => $LSM(LSM.clearSelection))
watch(Sidebar.$search, () => $LSM(LSM.clearSelection))
