// @flow
import type {CircleWidget, CircleWidgetType, Widget} from 'store/widgets/data/types';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {Values as StateValues} from 'store/widgetForms/circleChartForm/types';

export type Values = StateValues;

export type Props = {
	onChange: (value: Values) => any,
	onSave: (widget: CircleWidget) => any,
	type: CircleWidgetType,
	values: Values,
	widget: Widget
};

export type OnChange = SetFieldValue;
