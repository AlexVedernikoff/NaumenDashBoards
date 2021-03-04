// @flow
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';
import type {Props as SelectProps} from 'components/molecules/Select/types';

export type Option = any;

export type Components = $Shape<{
	List: $Shape<ListProps> => React$Node
}>;

export type Props = {
	droppable: boolean,
	onChangeLabel: (label: string) => void,
	onDrop: (name: string) => void,
} & SelectProps;

export type State = {
	showForm: boolean
};
