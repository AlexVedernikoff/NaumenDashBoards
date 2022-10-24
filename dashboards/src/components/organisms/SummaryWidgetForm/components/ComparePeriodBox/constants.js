// @flow
import {COMPARE_PERIOD} from 'store/widgets/data/constants';

const AVAILABLE_DATE_FORMATS = ['DD.MM.YY', 'DD.MM.YYYY'];

const SELECT_OPTIONS = [
	{label: 'Предыдущий день', value: COMPARE_PERIOD.PREVIOUS_DAY},
	{label: 'Предыдущая неделя', value: COMPARE_PERIOD.PREVIOUS_WEEK},
	{label: 'Предыдущий месяц', value: COMPARE_PERIOD.PREVIOUS_MONTH},
	{label: 'Предыдущий год', value: COMPARE_PERIOD.PREVIOUS_YEAR},
	{label: 'Произвольный диапазон', value: COMPARE_PERIOD.CUSTOM}
];

export {
	AVAILABLE_DATE_FORMATS,
	SELECT_OPTIONS
};
