// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/chart';

const POSITION_OPTIONS = [
	{
		name: ICON_NAMES.POSITION_LEFT,
		title: 'Слева',
		value: LEGEND_POSITIONS.left
	},
	{
		name: ICON_NAMES.POSITION_TOP,
		title: 'Вверху',
		value: LEGEND_POSITIONS.top
	},
	{
		name: ICON_NAMES.POSITION_RIGHT,
		title: 'Справа',
		value: LEGEND_POSITIONS.right
	},
	{
		name: ICON_NAMES.POSITION_BOTTOM,
		title: 'Внизу',
		value: LEGEND_POSITIONS.bottom
	}
];

const DISPLAY_TYPE_OPTIONS = [
	{
		name: ICON_NAMES.COLUMN,
		title: 'Вывести в столбец',
		value: LEGEND_DISPLAY_TYPES.BLOCK
	},
	{
		name: ICON_NAMES.ROW,
		title: 'Вывести в строку',
		value: LEGEND_DISPLAY_TYPES.INLINE
	}
];

export {
	DISPLAY_TYPE_OPTIONS,
	POSITION_OPTIONS
};
