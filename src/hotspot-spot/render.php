<?php
/**
 * Render hotspot spot block.
 *
 * @package FlashblocksHotspot
 */

if (! defined('ABSPATH')) {
	exit;
}

$pos_x = floatval($attributes['posX'] ?? 50);
$pos_y = floatval($attributes['posY'] ?? 50);

$context = wp_interactivity_data_wp_context([
	'isOpen' => false,
]);

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-flashblocks-hotspot-spot',
	'style' => sprintf('left: %s%%; top: %s%%', esc_attr($pos_x), esc_attr($pos_y)),
]);

echo <<<HTML
<div
	{$wrapper_attributes}
	data-wp-interactive="flashblocks/hotspot"
	{$context}
	data-wp-class--is-open="context.isOpen">
	<button
		class="wp-block-flashblocks-hotspot-spot__pin"
		type="button"
		data-wp-on--click="actions.toggle"
		aria-label="Hotspot marker"
		data-wp-bind--aria-expanded="context.isOpen">
	</button>
	<div
		class="wp-block-flashblocks-hotspot-spot__tooltip"
		role="tooltip"
		data-wp-bind--hidden="!context.isOpen">
		{$content}
	</div>
</div>
HTML;
