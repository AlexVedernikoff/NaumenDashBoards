// @flow
import {createRef} from 'react';
import isMobile from 'ismobilejs';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {Ref} from 'components/types';

export const gridRef: Ref<'div'> = createRef();

const DEFAULT_COLS_COUNT = 12;
const GRID_LAYOUT_HEIGHT = 50;

const GRID_PROPS: Object = {
	[LAYOUT_MODE.WEB]: {
		breakpoints: {
			lg: 768,
			sm: 0
		},
		cols: {
			lg: DEFAULT_COLS_COUNT,
			sm: 1
		},
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

// ширина сетки предпросмотра мобильного клиента с десктопа
const DESKTOP_MK_WIDTH = 320;

export {
	DESKTOP_MK_WIDTH,
	DEFAULT_COLS_COUNT,
	GRID_LAYOUT_HEIGHT,
	GRID_PROPS
};