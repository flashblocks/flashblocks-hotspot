import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Get the spot wrapper div from any element inside a spot (e.g. the pin button).
 */
const getSpotWrapper = ( el ) =>
	el.closest( '.wp-block-flashblocks-hotspot-spot' );

/**
 * Get the tooltip location selector from the parent hotspot container.
 * Reads data-tooltip-location attribute set on the container block.
 */
const getLocationSelector = ( el ) => {
	const hotspot = el.closest( '.wp-block-flashblocks-hotspot' );
	return hotspot?.getAttribute( 'data-tooltip-location' ) || '';
};

/**
 * Find the external tooltip location container for a given spot.
 */
const getExternalLocation = ( spotEl ) => {
	const selector = getLocationSelector( spotEl );
	if ( ! selector ) return null;
	return document.querySelector( selector );
};

/**
 * Show tooltip content in the external location container.
 * Accepts any element inside a spot (e.g. the pin button).
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
	loc.innerHTML = tooltip.innerHTML;
	return true;
};

/**
 * Clear the external location container for a given spot.
 */
const clearExternal = ( spotEl ) => {
	const loc = getExternalLocation( spotEl );
	if ( loc ) loc.innerHTML = '';
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

			if ( ctx.isOpen ) {
				ctx.isOpen = false;
				state.openSpot = null;
				clearExternal( ref );
			} else {
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
			}
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
				// Don't close when clicking inside the external location
				const selector = getLocationSelector( state.openSpot );
				if ( selector && e.target.closest( selector ) ) return;
				state.openSpot.__close();
				state.openSpot = null;
			} );
		},
	},
} );
