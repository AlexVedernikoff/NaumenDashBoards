// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {SetFieldValue} from 'components/organisms/WidgetForm/types';
import type {Values as SummaryValues} from 'store/widgetForms/summaryForm/types';
import type {Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import type {WidgetTooltip} from 'store/widgets/data/types';

export type Props = {
	onChange: SetFieldValue,
	value: SummaryValues | SpeedometerValues
};

export type State = {
	indicator: WidgetTooltip,
	selected: typeof DIAGRAM_FIELDS.indicator | typeof DIAGRAM_FIELDS.title,
	tooltip: WidgetTooltip
};
