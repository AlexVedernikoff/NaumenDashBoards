// @flow
import type {LangType} from 'localization/localize_types';

const WEEK_LABELS: Array<LangType> = [
	'Datepicker::Mon',
	'Datepicker::Tue',
	'Datepicker::Wed',
	'Datepicker::Thu',
	'Datepicker::Fri',
	'Datepicker::Sat',
	'Datepicker::Sun'
];

const WEEKEND_DAYS = [6, 7];

const LIMIT_DAYS = 42;

export {
	LIMIT_DAYS,
	WEEKEND_DAYS,
	WEEK_LABELS
};
