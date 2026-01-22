import { Sidebar } from "#features/Sidebar"
import { Views } from "#features/Views"
import { LSM } from "@monstermann/lsm"
import { effect, signal, watch } from "@monstermann/signals"
import { TrackList } from "."

export const $LSM = signal(LSM.create<string>())

effect(() => {
    const selectables = TrackList.$tracks().map(t => t.id)
    $LSM(lsm => LSM.setSelectables(lsm, selectables))
})

watch(Views.$selected, () => $LSM(LSM.clear))
watch(Sidebar.$search, () => $LSM(LSM.clear))
