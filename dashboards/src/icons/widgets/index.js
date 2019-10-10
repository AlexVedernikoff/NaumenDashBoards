// @flow
import Bar from './bar.svg';
import BarStacked from './bar_stacked.svg';
import {CHART_VARIANTS} from 'utils/chart';
import Column from './column.svg';
import ColumnStacked from './column_stacked.svg';
import Combo from './combo.svg';
import ComboStacked from './combo_stacked.svg';
import Donut from './donut.svg';
import Line from './line.svg';
import LineFlexible from './line_flexible.svg';
import Pie from './pie.svg';
import Summary from './summary.svg';
import Table from './table.svg';
import {WIDGET_VARIANTS} from 'utils/widget';

const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
const {SUMMARY, TABLE} = WIDGET_VARIANTS;

const icons = {
	[BAR]: Bar,
	[BAR_STACKED]: BarStacked,
	[COLUMN]: Column,
	[COLUMN_STACKED]: ColumnStacked,
	[COMBO]: Combo,
	[DONUT]: Donut,
	[LINE]: Line,
	[PIE]: Pie,
	[SUMMARY]: Summary,
	[TABLE]: Table
};

const getWidgetIcon = (name: string) => icons[name] || '';

export {
	Bar,
	BarStacked,
	Column,
	ColumnStacked,
	Combo,
	ComboStacked,
	Donut,
	getWidgetIcon,
	Line,
	LineFlexible,
	Pie,
	Summary,
	Table
};
