import { easeInOut } from "#config/easings"

export function bounce(id: string | undefined): void {
    if (!id) return
    document.querySelector(`[data-playlist-id="${id}"]`)?.firstElementChild?.animate([
        { transform: "scale(1)" },
        { transform: "scale(.94)" },
        { transform: "scale(1)" },
    ], { duration: 180, easing: easeInOut })
}
