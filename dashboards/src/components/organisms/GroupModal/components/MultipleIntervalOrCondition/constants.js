// @flow
import {INTERVAL_SYSTEM_GROUP} from 'src/store/widgets/constants';
import type {LangType} from 'localization/localize_types';

const OPTIONS: Array<{label: LangType, value: $Keys<typeof INTERVAL_SYSTEM_GROUP>}> = [
	{
		label: 'IntervalOrCondition::Seconds',
		value: INTERVAL_SYSTEM_GROUP.SECOND
	},
	{
		label: 'IntervalOrCondition::Minutes',
		value: INTERVAL_SYSTEM_GROUP.MINUTE
	},
	{
		label: 'IntervalOrCondition::Hours',
		value: INTERVAL_SYSTEM_GROUP.HOUR
	},
	{
		label: 'IntervalOrCondition::Days',
		value: INTERVAL_SYSTEM_GROUP.DAY
	},
	{
		label: 'IntervalOrCondition::Weeks',
		value: INTERVAL_SYSTEM_GROUP.WEEK
	}
];

export {
	OPTIONS
};
