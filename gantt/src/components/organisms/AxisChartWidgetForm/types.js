// @flow
import type {AxisWidget, AxisWidgetType, Widget} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {Values as StateValues} from 'store/widgetForms/axisChartForm/types';

export type OnChange = SetFieldValue;

export type Values = StateValues;

export type Props = {
	onChange: (values: Values) => any,
	onSave: (widget: AxisWidget) => any,
	type: AxisWidgetType,
	values: Values,
	widget: Widget | NewWidget
};
