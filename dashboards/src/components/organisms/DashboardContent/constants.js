// @flow
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';

const DEFAULT_COLS_COUNT = 12;
const GRID_LAYOUT_HEIGHT = 50;

const GRID_PROPS = {
	[LAYOUT_MODE.WEB]: {
		breakpoints: {
			lg: 768,
			sm: 0
		},
		cols: {
			lg: DEFAULT_COLS_COUNT,
			sm: 1
		},
		compactType: null,
		containerPadding: [20, 20],
		rowHeight: GRID_LAYOUT_HEIGHT
	},
	[LAYOUT_MODE.MOBILE]: {
		breakpoints: {
			lg: 0,
			sm: 0
		},
		cols: {
			lg: 1,
			sm: 1
		},
		containerPadding: isMobile.any ? [16, 20] : [20, 20],
		rowHeight: GRID_LAYOUT_HEIGHT
	},
	resizeHandles: ['sw', 'nw', 'se', 'ne']
};

export {
	DEFAULT_COLS_COUNT,
	GRID_LAYOUT_HEIGHT,
	GRID_PROPS
};
