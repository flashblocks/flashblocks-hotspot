import { store, getContext } from '@wordpress/interactivity';

store( 'flashblocks/hotspot', {
	actions: {
		toggle: () => {
			const ctx = getContext();
			ctx.isOpen = ! ctx.isOpen;
		},
		closeAll: () => {
			const ctx = getContext();
			ctx.isOpen = false;
		},
	},
} );
