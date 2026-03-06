# Flashblocks Hotspot

Place interactive hotspot markers on an image with tooltips that can contain any blocks.

## Build

```bash
npm install
npm run build    # production (uses --experimental-modules for Interactivity API)
npm run start    # dev with watch
```

Requires `--experimental-modules` flag for the `viewScriptModule` build (Interactivity API).

## Architecture

Two blocks registered via `blocks-manifest.php`:

### `flashblocks/hotspot` (Container) — Dynamic block

- **block.json**: `src/hotspot/block.json` — `render: file:./render.php`
- **edit.js**: `MediaPlaceholder` / `MediaReplaceFlow` for image selection, "Add Spot" toolbar button, `useInnerBlocksProps` for child spots, `InspectorControls` with tooltip settings (open on click, open on hover, external tooltip selector)
- **save.js**: Returns `<InnerBlocks.Content />` (preserves child block content for render.php)
- **render.php**: Server-side rendering with `data-tooltip-location`, `data-open-click`, `data-open-hover` data attributes
- **Attributes**: `mediaId`, `mediaUrl`, `mediaAlt`, `tooltipLocation` (CSS selector for external tooltip container), `openOnClick` (boolean, default true), `openOnHover` (boolean, default false)

### `flashblocks/hotspot-spot` (Child) — Dynamic block

- **block.json**: `parent: ["flashblocks/hotspot"]`, `render: file:./render.php`, `viewScriptModule: file:./view.js`
- **edit.js**: Pin button with drag-to-reposition via `setPointerCapture()` (bypasses editor's native block drag system), `useInnerBlocksProps` for tooltip content (visible when spot or descendant is selected), `InspectorControls` with RangeControl sliders for posX/posY
- **save.js**: Returns `<InnerBlocks.Content />` (required to serialize child blocks; returning `null` would lose tooltip content)
- **render.php**: Interactivity API markup — pin button + tooltip div with `$content` (InnerBlocks), mouseenter/mouseleave directives for hover support
- **view.js**: Interactivity store `flashblocks/hotspot` with click/hover open/close, external tooltip location support
- **Attributes**: `posX` (number, 0-100%), `posY` (number, 0-100%)

## Responsive Positioning

Spots use percentage-based `left`/`top` positioning within an `inset: 0` absolute container overlaying the image. The image is `width: 100%; height: auto`. This means spots scale proportionally at any viewport size.

The pin is centered on its coordinate via `transform: translate(-50%, -50%)`.

## Editor CSS Gotcha

The block editor wraps each inner block in `.wp-block` divs that inherit constrained-layout styles (`max-width`, `margin: auto`) from parent blocks like Cover or Group. The `editor.scss` for the hotspot container overrides these on spot wrappers:

```scss
&__spots > .wp-block {
    position: absolute !important;
    max-width: none !important;
    width: auto !important;
    margin: 0 !important;
}
```

**Do NOT use `display: contents` on these wrappers** — it removes the element's box, making `position`/`left`/`top` styles non-functional.

## Interactivity API

- Store name: `flashblocks/hotspot`
- Context per spot: `{ isOpen: false }`
- `actions.toggle` — click handler, opens/closes if `openOnClick` enabled
- `actions.hoverIn` / `actions.hoverOut` — hover handlers, open/close if `openOnHover` enabled
- When both click and hover are enabled: hover opens, click "pins" open (hover-out won't close a click-pinned spot)
- `data-wp-class--is-open="context.isOpen"` on spot wrapper for z-index stacking
- `data-wp-bind--hidden="!context.isOpen"` on tooltip for show/hide
- `data-wp-bind--aria-expanded="context.isOpen"` on pin button

## External Tooltip Location

- Set `tooltipLocation` attribute on the container block (CSS selector, e.g. `.tooltip-hotspot-location`)
- When a spot opens, its tooltip innerHTML is cloned to the external container
- Original content of the external container is saved and restored when all tooltips close
- The spot gets `[data-tooltip-external]` attribute so CSS can hide the inline tooltip

## File Structure

```
src/
  hotspot/            # Container block
    block.json
    index.js
    edit.js
    save.js
    style.scss        # position: relative container, image sizing, spots overlay
    editor.scss       # .wp-block overrides for editor layout compat
  hotspot-spot/       # Child block
    block.json
    index.js
    edit.js           # Pin + sidebar sliders + InnerBlocks tooltip
    save.js           # returns InnerBlocks.Content
    render.php        # Interactivity API frontend markup
    view.js           # Interactivity store
    style.scss        # Pin styling, tooltip positioning/arrow
    editor.scss       # Tooltip always visible when selected
```
