import { store, getContext, getElement } from '@wordpress/interactivity';

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
			} else {
				// Close any previously open spot.
				if ( state.openSpot && state.openSpot !== ref ) {
					state.openSpot.__close();
				}
				ctx.isOpen = true;
				ref.__close = () => { ctx.isOpen = false; };
				state.openSpot = ref;
			}
		},
	},
	callbacks: {
		initClickOutside: () => {
			// Registered once via data-wp-init on each spot.
			// The actual listener is shared via state.
			if ( state._listenerAdded ) return;
			state._listenerAdded = true;

			document.addEventListener( 'click', ( e ) => {
				if ( ! state.openSpot ) return;
				if ( e.target.closest( '.wp-block-flashblocks-hotspot-spot' ) ) return;
				state.openSpot.__close();
				state.openSpot = null;
			} );
		},
	},
} );
