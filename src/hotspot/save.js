/**
 * Save function — moved to render.php for dynamic rendering.
 * Kept here for reference in case we need to switch back to static.
 *
 * Previously rendered:
 *   <div { ...blockProps } data-tooltip-location="..." data-tooltip-trigger="...">
 *     <img class="__image" src={mediaUrl} alt={mediaAlt} />
 *     <div class="__spots"><InnerBlocks.Content /></div>
 *   </div>
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return <InnerBlocks.Content />;
}
