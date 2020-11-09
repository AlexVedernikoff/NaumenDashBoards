import {ICON_NAMES} from 'components/atoms/Icon';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const CHART_OPTIONS = [
	{
		label: ICON_NAMES.COLUMN_CHART,
		value: WIDGET_TYPES.COLUMN
	},
	{
		label: ICON_NAMES.STACKED_COLUMN_CHART,
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		label: ICON_NAMES.LINE_CHART,
		value: WIDGET_TYPES.LINE
	}
];

export {
	CHART_OPTIONS
};
