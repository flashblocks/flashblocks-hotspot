import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { mediaUrl, mediaAlt, tooltipLocation } = attributes;

	if ( ! mediaUrl ) {
		return null;
	}

	const extra = {};
	if ( tooltipLocation ) {
		extra[ 'data-tooltip-location' ] = tooltipLocation;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-flashblocks-hotspot',
		...extra,
	} );

	return (
		<div { ...blockProps }>
			<img
				className="wp-block-flashblocks-hotspot__image"
				src={ mediaUrl }
				alt={ mediaAlt || '' }
			/>
			<div className="wp-block-flashblocks-hotspot__spots">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
