// @flow
import type {SetFieldValue, Values} from 'components/organisms/WidgetForm/types';

export type ValuesContext = {
	setFieldValue: SetFieldValue,
	values: Values
};

export type InjectedProps<V: Values> = {
	setFieldValue: SetFieldValue,
	values: V
};
