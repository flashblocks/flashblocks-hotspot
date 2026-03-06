<?php
/**
 * Render hotspot container block.
 *
 * @package FlashblocksHotspot
 */

if (! defined('ABSPATH')) {
	exit;
}

$media_url = esc_url($attributes['mediaUrl'] ?? '');
$media_alt = esc_attr($attributes['mediaAlt'] ?? '');

if (! $media_url) {
	return;
}

$extra_attrs = '';
$tooltip_location = $attributes['tooltipLocation'] ?? '';
if ($tooltip_location) {
	$extra_attrs .= sprintf(' data-tooltip-location="%s"', esc_attr($tooltip_location));
}
$open_on_click = $attributes['openOnClick'] ?? true;
$open_on_hover = $attributes['openOnHover'] ?? false;
if (! $open_on_click) {
	$extra_attrs .= ' data-open-click="false"';
}
if ($open_on_hover) {
	$extra_attrs .= ' data-open-hover="true"';
}

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'wp-block-flashblocks-hotspot',
]);

echo <<<HTML
<div {$wrapper_attributes}{$extra_attrs}>
	<img class="wp-block-flashblocks-hotspot__image" src="{$media_url}" alt="{$media_alt}" />
	<div class="wp-block-flashblocks-hotspot__spots">
		{$content}
	</div>
</div>
HTML;
