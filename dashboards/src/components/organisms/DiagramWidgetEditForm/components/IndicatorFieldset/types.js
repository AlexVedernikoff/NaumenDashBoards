// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {Indicator, SourceData} from 'containers/DiagramWidgetEditForm/types';
import type {InjectedProps} from 'components/HOCs/withGetComponents/types';
import type {OnSelectEvent} from 'components/types';

export type Props = InjectedProps & ContextProps & {
	dataKey: string,
	dataSetIndex: number,
	error: string,
	index: number,
	onChange: (dataSetIndex: number, index: number, indicator: Indicator) => void,
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
