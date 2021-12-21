// @flow
import type {OnChange, Values} from 'components/organisms/SpeedometerWidgetForm/types';
import type {RaiseErrors} from 'containers/DiagramWidgetForm/types';

export type Props = {
	onChange: OnChange,
	raiseErrors: RaiseErrors,
	values: Values
};
