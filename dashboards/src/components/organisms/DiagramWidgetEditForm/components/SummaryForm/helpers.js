// @flow
import {DEFAULT_LAYOUT_HEIGHT, DEFAULT_LAYOUT_WIDTH} from './constants';
import {getCountGridColumns} from 'components/organisms/WidgetsGrid/helpers';
import {GRID_LAYOUT_HEIGHT} from 'components/organisms/WidgetsGrid/constants';
import type {LayoutMode} from 'store/dashboard/settings/types';

const getSummaryLayoutSize = (layoutMode: LayoutMode) => {
	const h = Math.round(DEFAULT_LAYOUT_HEIGHT / GRID_LAYOUT_HEIGHT);
	const w = Math.ceil(DEFAULT_LAYOUT_WIDTH / window.innerWidth * getCountGridColumns(layoutMode));

	return {
		h,
		w
	};
};

export {
	getSummaryLayoutSize
};
