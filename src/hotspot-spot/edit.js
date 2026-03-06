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
import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { posX, posY } = attributes;
	const [ isDragging, setIsDragging ] = useState( false );
	const spotRef = useRef();

	const blockProps = useBlockProps( {
		className: 'wp-block-flashblocks-hotspot-spot',
		style: {
			left: `${ posX }%`,
			top: `${ posY }%`,
		},
		ref: spotRef,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-flashblocks-hotspot-spot__tooltip' },
		{
			template: [
				[ 'core/paragraph', { placeholder: __( 'Tooltip content...', 'flashblocks-hotspot' ) } ],
			],
		}
	);

	const handlePointerDown = useCallback( ( e ) => {
		if ( e.target.closest( '.wp-block-flashblocks-hotspot-spot__tooltip' ) ) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		setIsDragging( true );
		spotRef.current?.setPointerCapture( e.pointerId );
	}, [] );

	const handlePointerMove = useCallback( ( e ) => {
		if ( ! isDragging ) return;

		const container = spotRef.current?.closest( '.wp-block-flashblocks-hotspot' );
		if ( ! container ) return;

		const rect = container.getBoundingClientRect();
		const x = Math.max( 0, Math.min( 100, ( ( e.clientX - rect.left ) / rect.width ) * 100 ) );
		const y = Math.max( 0, Math.min( 100, ( ( e.clientY - rect.top ) / rect.height ) * 100 ) );

		setAttributes( {
			posX: Math.round( x * 100 ) / 100,
			posY: Math.round( y * 100 ) / 100,
		} );
	}, [ isDragging, setAttributes ] );

	const handlePointerUp = useCallback( () => {
		setIsDragging( false );
	}, [] );

	useEffect( () => {
		if ( isDragging ) {
			document.addEventListener( 'pointermove', handlePointerMove );
			document.addEventListener( 'pointerup', handlePointerUp );
			return () => {
				document.removeEventListener( 'pointermove', handlePointerMove );
				document.removeEventListener( 'pointerup', handlePointerUp );
			};
		}
	}, [ isDragging, handlePointerMove, handlePointerUp ] );

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
					className={ `wp-block-flashblocks-hotspot-spot__pin${ isDragging ? ' is-dragging' : '' }` }
					type="button"
					onPointerDown={ handlePointerDown }
					aria-label={ __( 'Hotspot marker', 'flashblocks-hotspot' ) }
				/>
				{ isSelected && <div { ...innerBlocksProps } /> }
			</div>
		</>
	);
}
