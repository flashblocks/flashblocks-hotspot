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

	const handlePinPointerDown = ( e ) => {
		e.stopPropagation();
		e.preventDefault();
		selectBlock( clientId );

		const pin = e.currentTarget;
		pin.setPointerCapture( e.pointerId );

		const startX = e.clientX;
		const startY = e.clientY;
		const startPosX = posX;
		const startPosY = posY;

		const spotsContainer = pin.closest( '.wp-block-flashblocks-hotspot__spots' );
		if ( ! spotsContainer ) return;
		const rect = spotsContainer.getBoundingClientRect();

		let didDrag = false;

		const onMove = ( ev ) => {
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			if ( ! didDrag && Math.abs( dx ) < 3 && Math.abs( dy ) < 3 ) return;
			didDrag = true;
			const newX = Math.min( 100, Math.max( 0, startPosX + ( dx / rect.width ) * 100 ) );
			const newY = Math.min( 100, Math.max( 0, startPosY + ( dy / rect.height ) * 100 ) );
			setAttributes( {
				posX: Math.round( newX * 10 ) / 10,
				posY: Math.round( newY * 10 ) / 10,
			} );
		};

		const onUp = ( ev ) => {
			pin.releasePointerCapture( ev.pointerId );
			pin.removeEventListener( 'pointermove', onMove );
			pin.removeEventListener( 'pointerup', onUp );
		};

		pin.addEventListener( 'pointermove', onMove );
		pin.addEventListener( 'pointerup', onUp );
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
					onPointerDown={ handlePinPointerDown }
					aria-label={ __( 'Hotspot marker', 'flashblocks-hotspot' ) }
				/>
				{ isActive && <div { ...innerBlocksProps } /> }
			</div>
		</>
	);
}
