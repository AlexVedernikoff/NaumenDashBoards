// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import type {LangType} from 'localization/localize_types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const WIDGET_OPTIONS: Array<{icon: $Keys<typeof ICON_NAMES>, tip: LangType, value: $Keys<typeof WIDGET_TYPES>}> = [
	{
		icon: ICON_NAMES.COLUMN_CHART,
		tip: 'WidgetSelectBox::ColumnChart',
		value: WIDGET_TYPES.COLUMN
	},
	{
		icon: ICON_NAMES.STACKED_COLUMN_CHART,
		tip: 'WidgetSelectBox::StackedColumnChart',
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		icon: ICON_NAMES.STACKED_BAR_CHART,
		tip: 'WidgetSelectBox::StackedBarChart',
		value: WIDGET_TYPES.BAR_STACKED
	},
	{
		icon: ICON_NAMES.BAR_CHART,
		tip: 'WidgetSelectBox::BarChart',
		value: WIDGET_TYPES.BAR
	},
	{
		icon: ICON_NAMES.LINE_CHART,
		tip: 'WidgetSelectBox::LineChart',
		value: WIDGET_TYPES.LINE
	},
	{
		icon: ICON_NAMES.PIE_CHART,
		tip: 'WidgetSelectBox::PieChart',
		value: WIDGET_TYPES.PIE
	},
	{
		icon: ICON_NAMES.DONUT_CHART,
		tip: 'WidgetSelectBox::DonutChart',
		value: WIDGET_TYPES.DONUT
	},
	{
		icon: ICON_NAMES.COMBO_CHART,
		tip: 'WidgetSelectBox::ComboChart',
		value: WIDGET_TYPES.COMBO
	},
	{
		icon: ICON_NAMES.SUMMARY,
		tip: 'WidgetSelectBox::Summary',
		value: WIDGET_TYPES.SUMMARY
	},
	{
		icon: ICON_NAMES.TABLE,
		tip: 'WidgetSelectBox::Table',
		value: WIDGET_TYPES.TABLE
	},
	{
		icon: ICON_NAMES.SPEEDOMETER,
		tip: 'WidgetSelectBox::Speedometer',
		value: WIDGET_TYPES.SPEEDOMETER
	},
	{
		icon: ICON_NAMES.PIVOT_TABLE,
		tip: 'WidgetSelectBox::Pivot',
		value: WIDGET_TYPES.PIVOT_TABLE
	}
];

export {
	WIDGET_OPTIONS
};
