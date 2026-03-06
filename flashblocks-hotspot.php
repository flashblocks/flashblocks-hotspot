<?php
/**
 * Plugin Name:       Flashblocks Hotspot
 * Description:       Place interactive hotspots on an image with tooltips that can contain any blocks.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Sunny Morgan
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       flashblocks-hotspot
 *
 * @package FlashblocksHotspot
 */

if (! defined('ABSPATH')) {
	exit;
}

function flashblocks_hotspot_init() {
	$manifest_path = __DIR__ . '/build/blocks-manifest.php';
	if (! file_exists($manifest_path)) {
		return;
	}

	$manifest_data = require $manifest_path;
	foreach (array_keys($manifest_data) as $block_type) {
		register_block_type(__DIR__ . "/build/{$block_type}");
	}
}
add_action('init', 'flashblocks_hotspot_init');
