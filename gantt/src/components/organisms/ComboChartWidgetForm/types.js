// @flow
import type {ComboWidget, Widget} from 'src/store/widgets/data/types';
import NewWidget from 'src/store/widgets/data/NewWidget';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {Values as StateValues} from 'store/widgetForms/comboChartForm/types';

export type Values = StateValues;

export type OnChange = SetFieldValue;

export type Props = {
	onChange: (values: Values) => any,
	onSave: (widget: ComboWidget) => any,
	values: Values,
	widget: Widget | NewWidget
};
