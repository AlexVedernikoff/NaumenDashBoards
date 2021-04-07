// @flow
import type {LayoutMode} from 'store/dashboard/settings/types';
import type {LayoutPayloadForChange} from 'store/dashboard/layouts/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {SummaryWidget, Widget} from 'store/widgets/data/types';
import type {Values as StateValues} from 'store/widgetForms/summaryForm/types';

export type Values = StateValues;

export type OnChange = SetFieldValue;

export type Props = {
	layoutMode: LayoutMode,
	onChange: (values: Values) => any,
	onChangeLayout: (payload: LayoutPayloadForChange) => any,
	onSave: (widget: SummaryWidget) => any,
	values: Values,
	widget: Widget | NewWidget
};
