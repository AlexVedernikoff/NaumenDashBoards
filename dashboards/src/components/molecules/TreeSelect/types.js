// @flow
import type {InjectedProps} from 'components/HOCs/withGetComponents/types';
import type {OnSelectEvent, SelectValue} from 'components/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';

export type TreeSelectLabelContainerProps = ContainerProps & {
	value: SelectValue | null,
};

export type Components = {
	IndicatorsContainer: React$ComponentType<ContainerProps>,
	LabelContainer: React$ComponentType<TreeSelectLabelContainerProps>,
};

type Options = {
	[string]: Object
};

export type OnChangeLabelEvent = {
	label: string,
	name: string
};

export type OnRemoveEvent = {
	name: string
};

export type Props = {
	className: string,
	components: $Shape<Components>,
	getOptionLabel?: (option: SelectValue) => string,
	getOptionValue?: (option: SelectValue) => any,
	initialSelected: Array<string>,
	isActive: boolean,
	name: string,
	onChangeLabel: OnChangeLabelEvent => void,
	onRemove: OnRemoveEvent => void,
	onSelect: OnSelectEvent => void | Promise<void>,
	options: Options,
	placeholder: string,
	removable: boolean,
	value: SelectValue | null
};

export type State = {
	searchValue: string,
	showForm: boolean,
	showMenu: boolean
};

export type ContextProps = InjectedProps & Props;
