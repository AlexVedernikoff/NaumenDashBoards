// @flow
import type {IndicatorGrouping, PivotLink} from 'store/widgets/data/types';
import type {OnChange, Values} from 'components/organisms/PivotWidgetForm/types';
import type {ParameterOrder} from 'store/widgetForms/types';

export type Props = {
	onChange: OnChange,
	values: Values
};

export type PivotValueUpdate = {
	indicatorGrouping: IndicatorGrouping | null,
	links: Array<PivotLink>,
	parametersOrder: Array<ParameterOrder>,
};
