// @flow
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';

const EMPTY_DATA_OPTIONS: Array<{label: LangType, value: $Keys<typeof DEFAULT_TABLE_VALUE>}> = [
	{
		label: 'TableWidgetForm::BodySettingsBox::ShowZero',
		value: DEFAULT_TABLE_VALUE.ZERO
	},
	{
		label: 'TableWidgetForm::BodySettingsBox::ShowDash',
		value: DEFAULT_TABLE_VALUE.DASH
	},
	{
		label: 'TableWidgetForm::BodySettingsBox::ShowNull',
		value: DEFAULT_TABLE_VALUE.NULL
	},
	{
		label: 'TableWidgetForm::BodySettingsBox::ShowEmptyString',
		value: DEFAULT_TABLE_VALUE.EMPTY_ROW
	}
];

const PAGE_SIZES = [
	5,
	10,
	15,
	20,
	25,
	50,
	100
];

export {
	EMPTY_DATA_OPTIONS,
	PAGE_SIZES
};
