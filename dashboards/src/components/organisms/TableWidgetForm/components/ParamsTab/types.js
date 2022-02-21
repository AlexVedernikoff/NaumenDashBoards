// @flow
import type {CommonDialogContextProps} from 'containers/CommonDialogs/types';
import type {OnChange, Values} from 'components/organisms/TableWidgetForm/types';

export type Props = CommonDialogContextProps & {
	onChange: OnChange,
	values: Values
};
