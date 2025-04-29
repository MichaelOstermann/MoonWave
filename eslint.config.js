import monstermann from "@monstermann/eslint-config"

export default monstermann({
    react: true,
    tailwind: false,
    ignores: [
        "**/src-tauri",
        "src/config/icons.ts",
    ],
})
