// @flow
import {FONT_STYLES} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {LangType} from 'localization/localize_types';

const options: Array<{name: $Keys<typeof ICON_NAMES>, title: LangType, value: $Keys<typeof FONT_STYLES>}> = [
	{
		name: ICON_NAMES.BOLD,
		title: 'FontStyleControl::Bold',
		value: FONT_STYLES.BOLD
	},
	{
		name: ICON_NAMES.ITALIC,
		title: 'FontStyleControl::Italic',
		value: FONT_STYLES.ITALIC
	},
	{
		name: ICON_NAMES.UNDERLINE,
		title: 'FontStyleControl::Underline',
		value: FONT_STYLES.UNDERLINE
	}
];

export {
	options
};
