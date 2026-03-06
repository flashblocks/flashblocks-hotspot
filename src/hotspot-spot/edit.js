import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { attributes, setAttributes, isSelected, clientId } ) {
	const { posX, posY } = attributes;

	const { selectBlock } = useDispatch( blockEditorStore );
	const isActive = useSelect( ( select ) => {
		if ( isSelected ) return true;
		const { hasSelectedInnerBlock } = select( blockEditorStore );
		return hasSelectedInnerBlock( clientId, true );
	}, [ isSelected, clientId ] );

	const blockProps = useBlockProps( {
		className: 'wp-block-flashblocks-hotspot-spot',
		style: {
			left: `${ posX }%`,
			top: `${ posY }%`,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-flashblocks-hotspot-spot__tooltip' },
		{
			template: [
				[ 'core/paragraph', { placeholder: __( 'Tooltip content...', 'flashblocks-hotspot' ) } ],
			],
		}
	);

	const handlePinClick = ( e ) => {
		e.stopPropagation();
		selectBlock( clientId );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Position', 'flashblocks-hotspot' ) }>
					<RangeControl
						label={ __( 'Horizontal (%)', 'flashblocks-hotspot' ) }
						value={ posX }
						onChange={ ( val ) => setAttributes( { posX: val } ) }
						min={ 0 }
						max={ 100 }
						step={ 0.1 }
					/>
					<RangeControl
						label={ __( 'Vertical (%)', 'flashblocks-hotspot' ) }
						value={ posY }
						onChange={ ( val ) => setAttributes( { posY: val } ) }
						min={ 0 }
						max={ 100 }
						step={ 0.1 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<button
					className="wp-block-flashblocks-hotspot-spot__pin"
					type="button"
					onClick={ handlePinClick }
					aria-label={ __( 'Hotspot marker', 'flashblocks-hotspot' ) }
				/>
				{ isActive && <div { ...innerBlocksProps } /> }
			</div>
		</>
	);
}
