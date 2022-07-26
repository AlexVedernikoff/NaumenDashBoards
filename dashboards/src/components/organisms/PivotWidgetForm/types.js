// @flow
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props as ContainerProps} from 'containers/PivotWidgetForm/types';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {Values as StateValues} from 'store/widgetForms/pivotForm/types';
import type {Widget} from 'store/widgets/data/types';

export type Values = StateValues;

export type OnChange = SetFieldValue;

export type Props = ContainerProps & {
	widget: Widget | NewWidget
};
