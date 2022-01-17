// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import type {LangType} from 'localization/localize_types';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

const TEXT_HANDLERS_MODE: Array<{name: $Keys<typeof ICON_NAMES>, title: LangType, value: $Keys<typeof TEXT_HANDLERS>}> = [
	{
		name: ICON_NAMES.CROP,
		title: 'TextHandlerControl::Crop',
		value: TEXT_HANDLERS.CROP
	},
	{
		name: ICON_NAMES.WRAP,
		title: 'TextHandlerControl::Wrap',
		value: TEXT_HANDLERS.WRAP
	}
];

export {
	TEXT_HANDLERS_MODE
};
