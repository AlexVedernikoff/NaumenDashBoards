// @flow
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';

const EMPTY_DATA_OPTIONS = [
	{
		label: 'Показывать "0"',
		value: DEFAULT_TABLE_VALUE.ZERO
	},
	{
		label: 'Показывать "-"',
		value: DEFAULT_TABLE_VALUE.DASH
	},
	{
		label: 'Показывать "null"',
		value: DEFAULT_TABLE_VALUE.NULL
	},
	{
		label: 'Показывать пустую строку " "',
		value: DEFAULT_TABLE_VALUE.EMPTY_ROW
	}
];

export {
	EMPTY_DATA_OPTIONS
};
