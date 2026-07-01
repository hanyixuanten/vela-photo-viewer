# Xiaomi Vela JS Application Guidelines

## Project Overview

This is a Xiaomi Vela JS quickapp (快应用) targeting smartwatch/wearable devices. Use the `vela-quickapp` skill for Vela-specific tasks.

## Code Style

- All directory names use **lowercase** (`common/`, not `Common/`)
- Resource paths in manifest.json and CSS use absolute paths (`/common/icon.png`)
- Code imports use relative paths (`../common/utils`)
- Style units are `px` (logical pixels, auto-scaled by framework)
- Use Flexbox layout exclusively (`flex-direction`, `justify-content`, `align-items`)

## Architecture

```
src/
├── manifest.json     # App config (package, router, config fields are REQUIRED)
├── app.ux            # App entry point, import shared utilities here
├── pages/            # Each page = one directory with one .ux file
└── common/           # Shared resources: styles, utils, images
```

- Each page is a single `.ux` file with `<template>`, `<style>`, `<script>` sections
- `<template>` must have exactly one root node
- Data model uses `private: {}` in script (not `data`)
- Use `@system.*` imports for system APIs; declare in manifest `features` first

## Build and Test

```bash
npm install           # Install dependencies (includes aiot-toolkit)
node build.js         # Build debug .rpk → dist/
node build.js --release  # Build release .rpk (requires sign/ with certs)
```

## Conventions

- **manifest.json `config` field is mandatory** — omitting it causes build failure
- **Router paths must match directory structure** — `"entry": "pages/index"` maps to `src/pages/index/index.ux`
- **`component` value must match .ux filename** without extension
- **`designWidth`**: 480 for watch, adjust for other device types
- Use `{{}}` for data binding, `for="{{list}}"` for iteration, `if="{{cond}}"` for conditionals
- Event binding: `onclick="handler"` or `@click="handler"` (shorthand)
