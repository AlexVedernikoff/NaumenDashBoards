// @flow
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet, Indicator} from 'containers/DiagramWidgetEditForm/types';
import type {OnSelectEvent} from 'components/types';

export type Props = {
	...ContextProps,
	dataSet: DataSet,
	dataSetIndex: number,
	error: string,
	index: number,
	onChange: (dataSetIndex: number, index: number, indicator: Indicator) => void,
	onChangeLabel: (event: OnSelectEvent, index: number) => void,
	onRemove: (index: number) => void,
	removable: boolean,
	usesNotApplicableAggregation: boolean,
	value: Indicator
};

export type State = {
	showCreatingModal: boolean
};
