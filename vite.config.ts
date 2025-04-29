import { glob } from "node:fs/promises"
import fn from "@monstermann/unplugin-fn/vite"
import signalsReact from "@monstermann/unplugin-signals-react/vite"
import signals from "@monstermann/unplugin-signals/vite"
import treeshake from "@monstermann/unplugin-tree-shake-import-namespaces/vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const host = process.env["TAURI_DEV_HOST"]

const importNames = new Set(await Array
    .fromAsync(glob("./src/features/*"))
    .then((paths: string[]) => paths.map(path => path.split("/").at(-1))))

export default defineConfig(() => ({
    clearScreen: false,
    plugins: [
        tsconfigPaths({ projects: ["tsconfig.json"] }),
        tailwindcss(),
        fn({ enforce: "pre" }),
        signals({ enforce: "pre" }),
        signalsReact({ enforce: "pre" }),
        treeshake({
            enforce: "pre",
            resolve({ importAlias, importName, propertyName }) {
                if (!importNames.has(importName)) return
                return `import { ${propertyName} as ${importAlias} } from "#src/features/${importName}/${propertyName}";`
            },
        }),
        react({
            babel: {
                plugins: [
                    ["babel-plugin-react-compiler", {
                        logger: {
                            logEvent(filename: any, event: any) {
                                if (event.kind === "CompileError") {
                                    console.warn(event.kind, filename, event.detail.options.reason)
                                }
                            },
                        },
                    }],
                ],
            },
        }),
    ],
    resolve: {
        dedupe: ["react", "react-dom"],
    },
    server: {
        host: host || false,
        port: 1420,
        strictPort: true,
        hmr: host
            ? {
                    host,
                    port: 1421,
                    protocol: "ws",
                }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
}))
