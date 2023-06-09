// @flow
import type {ComboWidget, Widget} from 'store/widgets/data/types';
import type {CustomGroupsMap} from 'store/customGroups/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {ThunkAction} from 'store/types';
import type {Values} from 'store/widgetForms/comboChartForm/types';

export type ConnectedProps = {
	customGroups: CustomGroupsMap,
	values: Values
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onSave: (widget: ComboWidget) => ThunkAction
};

export type Props = {
	widget: Widget | NewWidget
} & ConnectedProps & ConnectedFunctions;
