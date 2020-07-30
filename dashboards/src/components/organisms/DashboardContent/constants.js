// @flow
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';

const GRID_PROPS = {
	[LAYOUT_MODE.WEB]: {
		breakpoints: {
			lg: 768,
			sm: 0
		},
		cols: {
			lg: 12,
			sm: 1
		},
		compactType: null,
		containerPadding: [10, 10],
		rowHeight: 50
	},
	[LAYOUT_MODE.MOBILE]: {
		breakpoints: {
			sm: 0
		},
		cols: {
			sm: 1
		},
		containerPadding: isMobile.any ? [16, 20] : [10, 10],
		rowHeight: 50
	}

};

export {
	GRID_PROPS
};
