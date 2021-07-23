// @flow
import NewWidget from 'src/store/widgets/data/NewWidget';
import type {SetFieldValue} from 'src/components/organisms/WidgetForm/types';
import type {SpeedometerWidget, Widget} from 'src/store/widgets/data/types';
import type {Values as StateValues} from 'store/widgetForms/speedometerForm/types';

export type Values = StateValues;

export type OnChange = SetFieldValue;

export type Props = {
	onChange: (values: Values) => any,
	onSave: (widget: SpeedometerWidget) => any,
	values: Values,
	widget: Widget | NewWidget
};
