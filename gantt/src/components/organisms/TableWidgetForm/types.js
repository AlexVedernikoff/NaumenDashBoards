// @flow
import NewWidget from 'store/widgets/data/NewWidget';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {TableWidget, Widget} from 'store/widgets/data/types';
import type {Values as StateValues} from 'store/widgetForms/tableForm/types';

export type Values = StateValues;

export type OnChange = SetFieldValue;

export type Props = {
	onChange: (values: Values) => any,
	onSave: (widget: TableWidget) => any,
	values: Values,
	widget: Widget | NewWidget
};
