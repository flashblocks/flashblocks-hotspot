=== Flashblocks Hotspot ===
Contributors:      Sunny Morgan
Tags:              hotspot, image, interactive, marker, tooltip
Tested up to:      6.8
Stable tag:        0.1.0
Requires at least: 6.8
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Place interactive hotspot markers on an image with tooltips that can contain any blocks.

== Description ==

Flashblocks Hotspot lets you select any image and place draggable hotspot markers on it. Each marker has a tooltip that supports full block content — paragraphs, images, buttons, or any other blocks you want.

= Features =

* Select any image as the hotspot background
* Add unlimited spot markers
* Drag markers to position them in the editor
* Fine-tune position with sidebar percentage sliders
* Tooltips support any block content (InnerBlocks)
* Click-to-toggle tooltips on the frontend (Interactivity API)
* Fully responsive — spots use percentage-based positioning
* Works inside Cover, Group, and other container blocks

= Blocks =

* **Hotspot** — Container block. Select an image, then add spots.
* **Hotspot Spot** — Child block. A single marker with a tooltip. Only available inside the Hotspot block.

== Installation ==

= From source =

1. Clone the repository into your `wp-content/plugins/` or `wp-content/mu-plugins/` directory
2. Run `npm install`
3. Run `npm run build`
4. Activate the plugin (or place in mu-plugins for auto-activation)

= Development =

1. Run `npm run start` for development mode with file watching
2. Edit files in `src/hotspot/` (container block) and `src/hotspot-spot/` (child block)
3. Build output goes to `build/`

== Usage ==

1. Add the **Hotspot** block to your page
2. Select an image using the media picker
3. Click the **Add Spot** button in the toolbar to add a marker
4. Drag the marker pin to position it on the image
5. Click the spot to open its tooltip editor — add any blocks inside
6. Adjust exact position with the Horizontal/Vertical sliders in the sidebar
7. On the frontend, visitors click a pin to toggle its tooltip

== Changelog ==

= 0.1.0 =
* Initial release
