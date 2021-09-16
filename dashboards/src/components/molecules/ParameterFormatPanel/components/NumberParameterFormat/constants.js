// @flow
import {NOTATION_FORMATS} from 'store/widgets/data/constants';

const ADDITIONAL_OPTIONS_UNDEFINED: 'Не указано' = 'Не указано';
const PERCENT: '%' = '%';
const RUB: 'руб.' = 'руб.';
const USD: '$' = '$';
const EURO: '€' = '€';

const ADDITIONAL_OPTIONS = [
	PERCENT,
	RUB,
	USD,
	EURO
];

const NOTATION_FORMATS_OPTIONS = [
	{label: 'тыс.', value: NOTATION_FORMATS.THOUSAND},
	{label: 'млн.', value: NOTATION_FORMATS.MILLION},
	{label: 'млрд.', value: NOTATION_FORMATS.BILLION},
	{label: 'трлн.', value: NOTATION_FORMATS.TRILLION}
];

export {
	NOTATION_FORMATS_OPTIONS,
	ADDITIONAL_OPTIONS_UNDEFINED,
	ADDITIONAL_OPTIONS
};
