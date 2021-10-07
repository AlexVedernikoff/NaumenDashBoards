// @flow
import type {ComputedAttr} from 'src/store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';
import type {InjectedProps as ValuesProps} from 'components/organisms/WidgetForm/HOCs/withValues/types';
import type {InjectedProps as HelpersProps} from 'containers/DiagramWidgetForm/HOCs/withHelpers/types';
import type {OnSelectEvent} from 'components/types';

export type Props = ValuesProps<{computedAttrs: Array<ComputedAttr>}> & HelpersProps & {
	className: ?string,
	dataKey: string,
	dataSetIndex: number,
	index: number,
	onChange: (index: number, indicator: Indicator) => void,
	onChangeLabel: (event: OnSelectEvent, index: number) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	source: SourceData,
	usesNotApplicableAggregation: boolean,
	value: Indicator
};

export type State = {
	showCreatingModal: boolean
};
