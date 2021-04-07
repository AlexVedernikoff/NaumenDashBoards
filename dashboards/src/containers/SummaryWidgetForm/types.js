// @flow
import NewWidget from 'store/widgets/data/NewWidget';
import type {SummaryWidget, Widget} from 'store/widgets/data/types';
import type {ThunkAction} from 'store/types';
import type {Values} from 'store/widgetForms/summaryForm/types';
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {LayoutPayloadForChange} from 'store/dashboard/layouts/types';

export type ConnectedProps = {
	layoutMode: LayoutMode,
	values: Values
};

export type ConnectedFunctions = {
	onChange: (values: Values) => ThunkAction,
	onChangeLayout: (payload: LayoutPayloadForChange) => ThunkAction,
	onSave: (widget: SummaryWidget) => ThunkAction
};

export type Props = {
	widget: Widget | NewWidget
} & ConnectedProps & ConnectedFunctions;
