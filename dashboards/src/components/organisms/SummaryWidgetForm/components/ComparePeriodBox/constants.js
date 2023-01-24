// @flow
import {COMPARE_PERIOD} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';

const AVAILABLE_DATE_FORMATS = ['DD.MM.YY', 'DD.MM.YYYY'];

const SELECT_OPTIONS: Array<{label: LangType, value: $Keys<typeof COMPARE_PERIOD>}> = [
	{label: 'ComparePeriodBox::PreviousDay', value: COMPARE_PERIOD.PREVIOUS_DAY},
	{label: 'ComparePeriodBox::PreviousWeek', value: COMPARE_PERIOD.PREVIOUS_WEEK},
	{label: 'ComparePeriodBox::PreviousMonth', value: COMPARE_PERIOD.PREVIOUS_MONTH},
	{label: 'ComparePeriodBox::PreviousYear', value: COMPARE_PERIOD.PREVIOUS_YEAR},
	{label: 'ComparePeriodBox::CustomRange', value: COMPARE_PERIOD.CUSTOM}
];

export {
	AVAILABLE_DATE_FORMATS,
	SELECT_OPTIONS
};
