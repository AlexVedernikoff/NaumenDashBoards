// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/recharts/constants';
import type {PositionOption} from './types';

const POSITION_OPTIONS: Array<PositionOption> = [
	{
		name: ICON_NAMES.POSITION_LEFT,
		title: 'LegendBox::PositionLeft',
		value: LEGEND_POSITIONS.left
	},
	{
		name: ICON_NAMES.POSITION_TOP,
		title: 'LegendBox::PositionTop',
		value: LEGEND_POSITIONS.top
	},
	{
		name: ICON_NAMES.POSITION_RIGHT,
		title: 'LegendBox::PositionRight',
		value: LEGEND_POSITIONS.right
	},
	{
		name: ICON_NAMES.POSITION_BOTTOM,
		title: 'LegendBox::PositionBottom',
		value: LEGEND_POSITIONS.bottom
	}
];

const DISPLAY_TYPE_OPTIONS: Array<PositionOption> = [
	{
		name: ICON_NAMES.COLUMN,
		title: 'LegendBox::Column',
		value: LEGEND_DISPLAY_TYPES.BLOCK
	},
	{
		name: ICON_NAMES.ROW,
		title: 'LegendBox::Row',
		value: LEGEND_DISPLAY_TYPES.INLINE
	}
];

export {
	DISPLAY_TYPE_OPTIONS,
	POSITION_OPTIONS
};
