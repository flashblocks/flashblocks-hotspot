import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	MediaPlaceholder,
	MediaReplaceFlow,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'flashblocks/hotspot-spot' ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mediaId, mediaUrl, mediaAlt } = attributes;

	const { insertBlock } = useDispatch( blockEditorStore );
	const innerBlockCount = useSelect(
		( select ) => select( blockEditorStore ).getBlockCount( clientId ),
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'wp-block-flashblocks-hotspot',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-flashblocks-hotspot__spots' },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			renderAppender: false,
		}
	);

	const onSelectMedia = ( media ) => {
		setAttributes( {
			mediaId: media.id,
			mediaUrl: media.url,
			mediaAlt: media.alt || '',
		} );
	};

	const addSpot = () => {
		const block = createBlock( 'flashblocks/hotspot-spot', {
			posX: 50,
			posY: 50,
		} );
		insertBlock( block, innerBlockCount, clientId );
	};

	if ( ! mediaUrl ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon="format-image"
					labels={ {
						title: __( 'Hotspot Image', 'flashblocks-hotspot' ),
						instructions: __( 'Select an image to place hotspots on.', 'flashblocks-hotspot' ),
					} }
					onSelect={ onSelectMedia }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
				/>
			</div>
		);
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						mediaId={ mediaId }
						mediaURL={ mediaUrl }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ onSelectMedia }
						name={ __( 'Replace Image', 'flashblocks-hotspot' ) }
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon="plus-alt"
						label={ __( 'Add Spot', 'flashblocks-hotspot' ) }
						onClick={ addSpot }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...blockProps }>
				<img
					className="wp-block-flashblocks-hotspot__image"
					src={ mediaUrl }
					alt={ mediaAlt }
				/>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
