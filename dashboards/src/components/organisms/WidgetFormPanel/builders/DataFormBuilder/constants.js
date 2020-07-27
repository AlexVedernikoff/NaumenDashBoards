// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {LAYOUT_MODE} from 'store/dashboard/constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const LAYOUT_MODE_OPTIONS = [
	{
		label: 'Только в WEB',
		value: LAYOUT_MODE.WEB
	},
	{
		label: 'Только в WEB и MK',
		value: LAYOUT_MODE.WEB_MK
	},
	{
		label: 'Только в MK',
		value: LAYOUT_MODE.MK
	}
];

const WIDGET_OPTIONS = [
	{
		icon: ICON_NAMES.COLUMN_CHART,
		tip: 'Столбчатая',
		value: WIDGET_TYPES.COLUMN
	},
	{
		icon: ICON_NAMES.STACKED_COLUMN_CHART,
		tip: 'Столбчатая c накоплением',
		value: WIDGET_TYPES.COLUMN_STACKED
	},
	{
		icon: ICON_NAMES.STACKED_BAR_CHART,
		tip: 'Гистограмма c накоплением',
		value: WIDGET_TYPES.BAR_STACKED
	},
	{
		icon: ICON_NAMES.BAR_CHART,
		tip: 'Гистограмма',
		value: WIDGET_TYPES.BAR
	},
	{
		icon: ICON_NAMES.LINE_CHART,
		tip: 'Линейная',
		value: WIDGET_TYPES.LINE
	},
	{
		icon: ICON_NAMES.PIE_CHART,
		tip: 'Круговая',
		value: WIDGET_TYPES.PIE
	},
	{
		icon: ICON_NAMES.DONUT_CHART,
		tip: 'Кольцевая',
		value: WIDGET_TYPES.DONUT
	},
	{
		icon: ICON_NAMES.COMBO_CHART,
		tip: 'Комбо',
		value: WIDGET_TYPES.COMBO
	},
	{
		icon: ICON_NAMES.SUMMARY,
		tip: 'Сводка',
		value: WIDGET_TYPES.SUMMARY
	},
	{
		icon: ICON_NAMES.TABLE,
		tip: 'Таблица',
		value: WIDGET_TYPES.TABLE
	},
	{
		icon: ICON_NAMES.SPEEDOMETER,
		tip: 'Спидометр',
		value: WIDGET_TYPES.SPEEDOMETER
	}
];

export {
	LAYOUT_MODE_OPTIONS,
	WIDGET_OPTIONS
};
