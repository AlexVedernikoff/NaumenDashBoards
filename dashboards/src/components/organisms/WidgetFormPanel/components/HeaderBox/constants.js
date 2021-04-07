// @flow
import {HEADER_POSITIONS} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';

const POSITION_OPTIONS = [
	{
		name: ICON_NAMES.POSITION_TOP,
		title: 'Отображать сверху',
		value: HEADER_POSITIONS.TOP
	},
	{
		name: ICON_NAMES.POSITION_BOTTOM,
		title: 'Отображать снизу',
		value: HEADER_POSITIONS.BOTTOM
	}
];

export {
	POSITION_OPTIONS
};
