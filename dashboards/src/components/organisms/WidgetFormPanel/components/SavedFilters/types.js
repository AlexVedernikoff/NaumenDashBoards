// @flow
import type {ComponentProps as ListProps} from 'components/molecules/Select/components/List/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';

export type Components = {|
	List: React$ComponentType<ListProps>,
	ValueContainer: React$ComponentType<ContainerProps>,
|};

export type SourceFiltersItem =
{
	descriptor: string,
	id: ?string,
	label: string,
};

export type Props = {
	className: string,
	filters: SourceFiltersItem[],
	isPersonal: boolean,
	loading: boolean,
	onDelete: (name: string) => void;
	onSelect: (value: SourceFiltersItem) => void;
};
