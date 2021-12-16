// @flow
import type {ChartSorting} from 'store/widgets/data/types';
import type {LangType} from 'localization/localize_types';

export type ContainerProps = {
	children: React$Node,
	className: string
};

export type Components = {
	Container: React$ComponentType<ContainerProps>
};

export type SortingValueOption = {
	disabled?: boolean,
	label: LangType,
	value: string
};

export type Props = {
	components: Components,
	name: string,
	onChange: (name: string, value: ChartSorting) => void,
	options: Array<SortingValueOption>,
	value: ChartSorting
};

export type State = {
	components: Components
};
