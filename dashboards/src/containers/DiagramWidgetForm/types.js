// @flow
import type {Schema} from 'components/types';
import type {SetFieldValue, Values} from 'components/organisms/WidgetForm/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	isPersonalDashboard: boolean,
	saving: boolean,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	cancelForm: () => void
};

export type TabProps = {
	onChange: SetFieldValue,
	values: Values
};

export type Components = {
	ParamsTab: React$ComponentType<TabProps>,
	StyleTab: React$ComponentType<TabProps>
};

export type Props = {
	components: Components,
	onChange: (values: Values) => any,
	onSubmit: (values: Values) => any,
	schema: Schema,
	values: Values
} & ConnectedProps & ConnectedFunctions;
