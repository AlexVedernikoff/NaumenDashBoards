// @flow
import type {InjectedProps} from 'components/organisms/WidgetForm/HOCs/withErrors/types';
import type {Props as FieldProps} from 'components/atoms/FieldError/types';

export type Props = FieldProps & InjectedProps & {
	path: string
};
