// @flow
import {FONT_STYLES} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';

const options = [
	{
		name: ICON_NAMES.BOLD,
		title: 'Жирный',
		value: FONT_STYLES.BOLD
	},
	{
		name: ICON_NAMES.ITALIC,
		title: 'Курсив',
		value: FONT_STYLES.ITALIC
	},
	{
		name: ICON_NAMES.UNDERLINE,
		title: 'Подчеркнутый',
		value: FONT_STYLES.UNDERLINE
	}
];

export {
	options
};
