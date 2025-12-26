<div align="center">

![Icon](./src-tauri/icons/128x128.png)

🚧 **WIP** 🚧

<h1>MoonWave</h1>

**Cross-platform music player for local files.**

</div>

![Dark](./screenshots/dark.png)

![Light](./screenshots/light.png)

## Installation

See [releases](https://github.com/MichaelOstermann/MoonWave/releases/latest).

## Building

Requirements:

- [Tauri](https://v2.tauri.app/start/prerequisites/#macos)
- [Bun](https://bun.sh/)

```sh
bun install --frozen-lockfile
bun run tauri build
```

Afterwards, the app can be found in `src-tauri/target/*/release/**`.
