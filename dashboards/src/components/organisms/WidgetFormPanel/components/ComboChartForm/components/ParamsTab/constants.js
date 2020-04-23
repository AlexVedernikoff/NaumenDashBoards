import {Column, ColumnStacked, Line} from 'icons/widgets';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const CHART_OPTIONS = [
	{
		label: Column,
		value: WIDGET_TYPES.COLUMN
	},
	{
		label: ColumnStacked,
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		label: Line,
		value: WIDGET_TYPES.LINE
	}
];

export {
	CHART_OPTIONS
};
