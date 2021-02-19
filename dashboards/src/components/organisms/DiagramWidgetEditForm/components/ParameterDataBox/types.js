// @flow
import type {ErrorsMap, SetDataFieldValue, SetFieldValue, Values} from 'containers/WidgetEditForm/types';

export type Props = {
	errors: ErrorsMap,
	setDataFieldValue: SetDataFieldValue,
	setFieldValue: SetFieldValue,
	values: Values
};
