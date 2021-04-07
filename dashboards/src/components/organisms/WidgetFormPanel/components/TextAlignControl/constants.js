// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {TEXT_ALIGNS} from 'store/widgets/data/constants';

const options = [
	{
		name: ICON_NAMES.ALIGN_LEFT,
		title: 'По левому краю',
		value: TEXT_ALIGNS.left
	},
	{
		name: ICON_NAMES.ALIGN_CENTER,
		title: 'По центру',
		value: TEXT_ALIGNS.center
	},
	{
		name: ICON_NAMES.ALIGN_RIGHT,
		title: 'По правому краю',
		value: TEXT_ALIGNS.right
	}
];

export {
	options
};
