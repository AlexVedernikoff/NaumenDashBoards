// @flow
import {DEFAULT_VARIANTS, INTEGER_VARIANTS} from './constansts';

const DEFAULT = [
	{
		label: 'Количество',
		value: DEFAULT_VARIANTS.COUNT
	},
	{
		label: 'Проценты',
		value: DEFAULT_VARIANTS.PERCENT
	}
];

const INTEGER = [
	{
		label: 'Сумма',
		value: INTEGER_VARIANTS.SUM
	},
	{
		label: 'Среднее значение',
		value: INTEGER_VARIANTS.AVERAGE
	},
	{
		label: 'Максимальное значение',
		value: INTEGER_VARIANTS.MAX
	},
	{
		label: 'Минимальное значение',
		value: INTEGER_VARIANTS.MIN
	},
	{
		label: 'Медиана',
		value: INTEGER_VARIANTS.MEDIAN
	}
];

const AGGREGATE_SELECTS = {
	DEFAULT,
	INTEGER
};

export {
	AGGREGATE_SELECTS
};
