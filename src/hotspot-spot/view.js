import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Get the spot wrapper div from any element inside a spot (e.g. the pin button).
 */
const getSpotWrapper = ( el ) =>
	el.closest( '.wp-block-flashblocks-hotspot-spot' );

/**
 * Get the parent hotspot container from any element inside it.
 */
const getHotspot = ( el ) =>
	el.closest( '.wp-block-flashblocks-hotspot' );

/**
 * Get the tooltip location selector from the parent hotspot container.
 */
const getLocationSelector = ( el ) => {
	const hotspot = getHotspot( el );
	return hotspot?.getAttribute( 'data-tooltip-location' ) || '';
};

/**
 * Get the trigger mode from the parent hotspot container.
 */
const getTriggerMode = ( el ) => {
	const hotspot = getHotspot( el );
	return hotspot?.getAttribute( 'data-tooltip-trigger' ) || 'click';
};

/**
 * Find the external tooltip location container for a given element.
 */
const getExternalLocation = ( el ) => {
	const selector = getLocationSelector( el );
	if ( ! selector ) return null;
	return document.querySelector( selector );
};

/**
 * Save the original content of the external location (once).
 */
const saveOriginalContent = ( el ) => {
	const loc = getExternalLocation( el );
	if ( ! loc || loc.__originalSaved ) return;
	loc.__originalHTML = loc.innerHTML;
	loc.__originalSaved = true;
};

/**
 * Restore the original content of the external location.
 */
const restoreOriginalContent = ( el ) => {
	const loc = getExternalLocation( el );
	if ( ! loc || ! loc.__originalSaved ) return;
	loc.innerHTML = loc.__originalHTML;
};

/**
 * Show tooltip content in the external location container.
 */
const showExternal = ( el ) => {
	const loc = getExternalLocation( el );
	if ( ! loc ) return false;
	const spot = getSpotWrapper( el );
	if ( ! spot ) return false;
	const tooltip = spot.querySelector(
		'.wp-block-flashblocks-hotspot-spot__tooltip'
	);
	if ( ! tooltip ) return false;
	saveOriginalContent( el );
	loc.innerHTML = tooltip.innerHTML;
	return true;
};

/**
 * Restore original content in the external location.
 */
const clearExternal = ( el ) => {
	restoreOriginalContent( el );
};

/**
 * Open a spot: show tooltip, handle external location, track state.
 */
const openSpot = ( ref, ctx ) => {
	// Close any previously open spot.
	if ( state.openSpot && state.openSpot !== ref ) {
		state.openSpot.__close();
	}
	ctx.isOpen = true;
	const hasExternal = showExternal( ref );
	const spot = getSpotWrapper( ref );
	if ( hasExternal && spot ) {
		spot.setAttribute( 'data-tooltip-external', '' );
	}
	ref.__close = () => {
		ctx.isOpen = false;
		if ( spot ) {
			spot.removeAttribute( 'data-tooltip-external' );
		}
		clearExternal( ref );
	};
	state.openSpot = ref;
};

/**
 * Close a spot.
 */
const closeSpot = ( ref, ctx ) => {
	ctx.isOpen = false;
	state.openSpot = null;
	clearExternal( ref );
	const spot = getSpotWrapper( ref );
	if ( spot ) {
		spot.removeAttribute( 'data-tooltip-external' );
	}
};

const { state } = store( 'flashblocks/hotspot', {
	state: {
		openSpot: null,
	},
	actions: {
		stopProp: ( e ) => {
			e.stopPropagation();
		},
		toggle: ( e ) => {
			e.stopPropagation();
			const ctx = getContext();
			const { ref } = getElement();

			// In hover mode, clicking the pin does nothing.
			if ( getTriggerMode( ref ) === 'hover' ) return;

			if ( ctx.isOpen ) {
				closeSpot( ref, ctx );
			} else {
				openSpot( ref, ctx );
			}
		},
		hoverIn: () => {
			const { ref } = getElement();
			if ( getTriggerMode( ref ) !== 'hover' ) return;
			const ctx = getContext();
			if ( ctx.isOpen ) return;
			openSpot( ref, ctx );
		},
		hoverOut: () => {
			const { ref } = getElement();
			if ( getTriggerMode( ref ) !== 'hover' ) return;
			const ctx = getContext();
			if ( ! ctx.isOpen ) return;
			closeSpot( ref, ctx );
		},
	},
	callbacks: {
		initClickOutside: () => {
			if ( state._listenerAdded ) return;
			state._listenerAdded = true;

			document.addEventListener( 'click', ( e ) => {
				if ( ! state.openSpot ) return;
				if (
					e.target.closest( '.wp-block-flashblocks-hotspot-spot' )
				)
					return;
				const selector = getLocationSelector( state.openSpot );
				if ( selector && e.target.closest( selector ) ) return;
				state.openSpot.__close();
				state.openSpot = null;
			} );
		},
	},
} );
