// @flow
import type {DataSet} from 'store/widgetForms/tableForm/types';
import type {Indicator} from 'store/widgetForms/types';
import type {OnChange, Values} from 'components/organisms/TableWidgetForm/types';
import type {WidgetTooltip} from 'store/widgets/data/types';

export type Props = {
	onChange: OnChange,
	value: Values
};

export type State = {
	indicatorPositions: Array<string>,
	indicatorRefs: Array<Indicator>,
	newValue: Array<DataSet>,
	showIndicators: boolean,
	tooltip: WidgetTooltip,
	unusedIndicators: Array<Indicator>
};
