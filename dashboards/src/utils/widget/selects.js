// @flow
import {Summary, Table} from 'icons/widgets';
import {WIDGET_VARIANTS} from './constansts';

const WIDGET_SELECTS = [
	{
		icon: Table,
		label: 'Таблица',
		value: WIDGET_VARIANTS.TABLE
	},
	{
		icon: Summary,
		label: 'Сводка',
		value: WIDGET_VARIANTS.SUMMARY
	}
];

export {
	WIDGET_SELECTS
};
