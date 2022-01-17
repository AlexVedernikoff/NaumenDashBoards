// @flow
import type {LangType} from 'localization/localize_types';
import {RANGES_POSITION} from 'store/widgets/data/constants';

const RANGES_POSITION_OPTIONS: Array<{title: LangType, value: $Keys<typeof RANGES_POSITION>}> = [
	{
		title: 'BordersRangesStyleBox::OnArc',
		value: RANGES_POSITION.CURVE
	},
	{
		title: 'BordersRangesStyleBox::OnArc',
		value: RANGES_POSITION.LEGEND
	}
];

const FONT_SIZE_OPTIONS = [14, 15, 16, 17, 18];

export {
	FONT_SIZE_OPTIONS,
	RANGES_POSITION_OPTIONS
};
