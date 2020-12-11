// @flow
import type {ChartSorting} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';

export type Components = {
	Container: React$ComponentType<ContainerProps>
};

export type SortingValueOption = {
	disabled?: boolean,
	label: string,
	value: string
};

export type Props = {
	components?: $Shape<Components>,
	data: ChartSorting,
	name: string,
	onChange: (name: string, data: ChartSorting) => void,
	options: Array<SortingValueOption>
};

export type State = {
	components: Components
};
