// @flow
// import {ICON_NAMES} from 'components/atoms/Icon';
import {RANGES_POSITION} from 'store/widgets/data/constants';

const RANGES_POSITION_OPTIONS = [
	{
		title: 'На дуге',
		value: RANGES_POSITION.CURVE
	},
	{
		title: 'В легенде',
		value: RANGES_POSITION.LEGEND
	}
];

const FONT_SIZE_OPTIONS = [14, 15, 16, 17, 18];

export {
	FONT_SIZE_OPTIONS,
	RANGES_POSITION_OPTIONS
};
