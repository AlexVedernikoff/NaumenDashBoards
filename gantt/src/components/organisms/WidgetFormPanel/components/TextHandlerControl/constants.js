// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

const options = [
	{
		name: ICON_NAMES.CROP,
		title: 'Обрезать текст',
		value: TEXT_HANDLERS.CROP
	},
	{
		name: ICON_NAMES.WRAP,
		title: 'Переносить по словам',
		value: TEXT_HANDLERS.WRAP
	}
];

export {
	options
};
