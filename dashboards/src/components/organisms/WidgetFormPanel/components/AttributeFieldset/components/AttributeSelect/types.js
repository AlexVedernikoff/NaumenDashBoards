// @flow
import type {Components as SelectComponents, Props as SelectProps} from 'components/molecules/Select/types';

export type Components = {|
	Field: React$ComponentType<{}>
|} & $Shape<SelectComponents>;

export type Props = {
	...SelectProps,
	components: $Shape<Components>,
	droppable: boolean,
	onChangeLabel: (label: string) => void,
	onDrop?: (name: string) => void,
	onRemove?: (name: string) => void,
	removable: boolean,
};

export type State = {
	showForm: boolean
};
