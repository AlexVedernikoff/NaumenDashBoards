// @flow
import {createRef} from 'react';
import isMobile from 'ismobilejs';
import {LAYOUT_BREAKPOINTS, LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {Ref} from 'components/types';

export const gridRef: Ref<'div'> = createRef();

const DEFAULT_COLS_COUNT = 12;
const GRID_LAYOUT_HEIGHT = 50;

const GRID_PROPS: Object = {
	[LAYOUT_MODE.WEB]: {
		breakpoints: {
			[LAYOUT_BREAKPOINTS.LG]: 768,
			[LAYOUT_BREAKPOINTS.SM]: 0
		},
		cols: {
			[LAYOUT_BREAKPOINTS.LG]: DEFAULT_COLS_COUNT,
			[LAYOUT_BREAKPOINTS.SM]: 1
		},
		containerPadding: [20, 20],
		rowHeight: GRID_LAYOUT_HEIGHT
	},
	[LAYOUT_MODE.MOBILE]: {
		breakpoints: {
			[LAYOUT_BREAKPOINTS.LG]: 0,
			[LAYOUT_BREAKPOINTS.SM]: 0
		},
		cols: {
			[LAYOUT_BREAKPOINTS.LG]: 1,
			[LAYOUT_BREAKPOINTS.SM]: 1
		},
		containerPadding: isMobile.any ? [16, 20] : [20, 20],
		rowHeight: GRID_LAYOUT_HEIGHT
	},
	resizeHandles: ['sw', 'nw', 'se', 'ne']
};

// ширина сетки предпросмотра мобильного клиента с десктопа
const DESKTOP_MK_WIDTH = 320;

export {
	DESKTOP_MK_WIDTH,
	DEFAULT_COLS_COUNT,
	GRID_LAYOUT_HEIGHT,
	GRID_PROPS
};
