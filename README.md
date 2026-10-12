> [!WARNING]
> This project is no longer maintained.

MoonWave was my way of working out from scratch how I want to build apps: which libraries, which tools, and TypeScript after a decade of JavaScript. I also could not find a music player I liked.

[Tauri](https://tauri.app) turned out to be a good fit for web apps, local-first ones in particular. What I learned ended up in [stdlib](https://github.com/MichaelOstermann/stdlib), [signals](https://github.com/MichaelOstermann/signals) and [barrels](https://github.com/MichaelOstermann/barrels), which gives you namespaces that still tree-shake. For music I have since moved on to [mpdtui](https://github.com/MichaelOstermann/mpdtui).

<div align="center">

![Icon](./src-tauri/icons/128x128.png)

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
