// @flow
import {DT_INTERVAL_PERIOD} from 'store/widgets/data/constants';
import type {LangType} from 'localization/localize_types';

export const DT_INTERVAL_PERIOD_OPTIONS: Array<{label: LangType, value: $Keys<typeof DT_INTERVAL_PERIOD>}> = [
	{
		label: 'DTIntervalFormat::NotSelect',
		value: DT_INTERVAL_PERIOD.NOT_SELECTED
	},
	{
		label: 'DTIntervalFormat::Seconds',
		value: DT_INTERVAL_PERIOD.SECONDS
	},
	{
		label: 'DTIntervalFormat::Minutes',
		value: DT_INTERVAL_PERIOD.MINUTES
	},
	{
		label: 'DTIntervalFormat::Hours',
		value: DT_INTERVAL_PERIOD.HOURS
	},
	{
		label: 'DTIntervalFormat::Day',
		value: DT_INTERVAL_PERIOD.DAY
	},
	{
		label: 'DTIntervalFormat::Week',
		value: DT_INTERVAL_PERIOD.WEEK
	}
];
