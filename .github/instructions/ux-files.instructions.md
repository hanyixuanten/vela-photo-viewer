---
description: "Use when creating or editing .ux files for Xiaomi Vela JS applications. Covers template structure, data binding, event handling, list rendering, conditional rendering, style conventions, and script lifecycle."
applyTo: "**/*.ux"
---

# UX File Guidelines

## File Structure

Every `.ux` file has exactly three sections in this order:

```html
<template>
  <!-- single root node only -->
</template>

<style>
  /* Flexbox-only layout */
</style>

<script>
  // MVVM data model
</script>
```

## Template Rules

- **Single root node** — `<template>` must contain exactly one root `<div>`
- **Never use `<block>` as root** — only as a child for logical grouping
- **Data binding**: `{{variable}}` — no expressions with side effects
- **Events**: `onclick="handler"` or `@click="handler"` shorthand
- **Lists**: `for="{{list}}"` with `tid="uniqueField"` for performance
- **Conditionals**: `if`/`elif`/`else` must be adjacent sibling nodes

### List Rendering

```html
<!-- Default names: $item, $idx -->
<div for="{{items}}" tid="id">
  <text>{{$idx}}: {{$item.name}}</text>
</div>

<!-- Custom names -->
<div for="{{(index, item) in items}}">
  <text>{{index}}: {{item.name}}</text>
</div>
```

### Conditional Rendering

```html
<text if="{{status === 'ok'}}">Success</text>
<text elif="{{status === 'error'}}">Failed</text>
<text else>Loading</text>
```

- `if` removes from VDOM when false; `show` just hides (keeps in VDOM)

## Style Rules

- Use **Flexbox** exclusively — no float, no grid
- Units are **`px`** only (logical pixels, auto-scaled)
- Prefer `class` over inline `style` for reusable patterns
- Resource paths in `url()` use **absolute paths**: `url(/common/bg.png)`

## Script Rules

- Use `private: {}` for page data (not `data`)
- `private` properties are **not overridable** by parent components
- Import system APIs: `import router from '@system.router'`
- Declare used APIs in manifest.json `features` array first

### Lifecycle Hooks

```javascript
export default {
  private: { /* reactive data */ },
  onInit() {},    // data initialized
  onReady() {},   // DOM rendered
  onShow() {},    // page visible
  onHide() {},    // page hidden
  onDestroy() {}  // page destroyed
}
```

## Common Mistakes

- Multiple root nodes in `<template>` → wrap in single `<div>`
- Using relative paths in manifest.json `icon` → use `/common/icon.png`
- Missing `config` field in manifest.json → build fails
- Router path doesn't match directory → page not found
- `for` without `tid` → poor list update performance
