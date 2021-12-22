// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import type {LangType} from 'localization/localize_types';
import {TEXT_ALIGNS} from 'store/widgets/data/constants';

const ALIGN_OPTIONS: Array<{name: $Keys<typeof ICON_NAMES>, title: LangType, value: $Keys<typeof TEXT_ALIGNS>}> = [
	{
		name: ICON_NAMES.ALIGN_LEFT,
		title: 'TextAlignControl::AlignLeft',
		value: TEXT_ALIGNS.left
	},
	{
		name: ICON_NAMES.ALIGN_CENTER,
		title: 'TextAlignControl::AlignCenter',
		value: TEXT_ALIGNS.center
	},
	{
		name: ICON_NAMES.ALIGN_RIGHT,
		title: 'TextAlignControl::AlignRight',
		value: TEXT_ALIGNS.right
	}
];

export {
	ALIGN_OPTIONS
};
