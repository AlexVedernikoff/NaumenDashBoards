// @flow
import type {Header} from 'store/widgets/data/types';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';

export type Values = {
	header: Header,
	name: string,
	templateName: string
};

export type Props = {
	onChange: SetFieldValue,
	values: Values
};
