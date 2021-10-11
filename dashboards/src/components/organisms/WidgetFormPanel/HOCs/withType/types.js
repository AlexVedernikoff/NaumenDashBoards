// @flow
import type {AnyWidget, WidgetType} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {SetFieldValue, Values} from 'components/organisms/WidgetForm/types';

export type Context = {
	onChange: (type: string, callback: () => mixed) => void,
	value: WidgetType
};

export type Props = {
	setFieldValue: SetFieldValue,
	type: Context,
	values: Values,
	widget: AnyWidget | NewWidget
};
