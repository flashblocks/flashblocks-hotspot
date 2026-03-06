import { store, getContext, getElement } from '@wordpress/interactivity';

const SPOT_SEL = '.wp-block-flashblocks-hotspot-spot';
const TOOLTIP_SEL = '.wp-block-flashblocks-hotspot-spot__tooltip';

const getSpotWrapper = ( el ) => el.closest( SPOT_SEL );
const getHotspot = ( el ) => el.closest( '.wp-block-flashblocks-hotspot' );

const getHotspotAttr = ( el, name ) => getHotspot( el )?.getAttribute( name );
const isClickEnabled = ( el ) => getHotspotAttr( el, 'data-open-click' ) !== 'false';
const isHoverEnabled = ( el ) => getHotspotAttr( el, 'data-open-hover' ) === 'true';

/**
 * External tooltip location helpers.
 */
const getExternalLocation = ( el ) => {
	const selector = getHotspotAttr( el, 'data-tooltip-location' );
	return selector ? document.querySelector( selector ) : null;
};

const showExternal = ( el ) => {
	const loc = getExternalLocation( el );
	if ( ! loc ) return false;
	const tooltip = getSpotWrapper( el )?.querySelector( TOOLTIP_SEL );
	if ( ! tooltip ) return false;
	if ( ! loc.__originalSaved ) {
		loc.__originalHTML = loc.innerHTML;
		loc.__originalSaved = true;
	}
	loc.innerHTML = tooltip.innerHTML;
	return true;
};

const clearExternal = ( el ) => {
	const loc = getExternalLocation( el );
	if ( loc?.__originalSaved ) {
		loc.innerHTML = loc.__originalHTML;
	}
};

/**
 * Open/close a spot, managing external tooltip and global tracking.
 */
const openSpot = ( ref, ctx ) => {
	if ( state.openSpot && state.openSpot !== ref ) {
		state.openSpot.__close();
	}
	ctx.isOpen = true;
	const spot = getSpotWrapper( ref );
	if ( showExternal( ref ) && spot ) {
		spot.setAttribute( 'data-tooltip-external', '' );
	}
	ref.__close = () => {
		ctx.isOpen = false;
		spot?.removeAttribute( 'data-tooltip-external' );
		clearExternal( ref );
		state.openSpot = null;
	};
	state.openSpot = ref;
};

const closeSpot = ( ref ) => {
	ref.__close?.();
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
			const { ref } = getElement();
			if ( ! isClickEnabled( ref ) ) return;
			const ctx = getContext();
			const spot = getSpotWrapper( ref );
			if ( ctx.isOpen && spot?.__clickedOpen ) {
				// Click-pinned — close it.
				closeSpot( ref );
				if ( spot ) spot.__clickedOpen = false;
			} else {
				// Closed or hover-opened — pin it open.
				if ( ! ctx.isOpen ) openSpot( ref, ctx );
				if ( spot ) spot.__clickedOpen = true;
			}
		},
		hoverIn: () => {
			const { ref } = getElement();
			if ( ! isHoverEnabled( ref ) ) return;
			const ctx = getContext();
			if ( ctx.isOpen ) return;
			openSpot( ref, ctx );
		},
		hoverOut: () => {
			const { ref } = getElement();
			if ( ! isHoverEnabled( ref ) ) return;
			const ctx = getContext();
			if ( ! ctx.isOpen ) return;
			const spot = getSpotWrapper( ref );
			if ( isClickEnabled( ref ) && spot?.__clickedOpen ) return;
			closeSpot( ref );
		},
	},
	callbacks: {
		initClickOutside: () => {
			if ( state._listenerAdded ) return;
			state._listenerAdded = true;

			document.addEventListener( 'click', ( e ) => {
				if ( ! state.openSpot ) return;
				if ( e.target.closest( SPOT_SEL ) ) return;
				const selector = getHotspotAttr(
					state.openSpot,
					'data-tooltip-location'
				);
				if ( selector && e.target.closest( selector ) ) return;
				state.openSpot.__close();
			} );
		},
	},
} );
