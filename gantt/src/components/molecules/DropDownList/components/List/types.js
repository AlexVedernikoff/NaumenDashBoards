// @flow
import type {Props as ListItemProps} from 'components/molecules/DropDownList/components/ListItem/types';

export type Item = {
	label: string,
	value: string
};

type Components = {
	ListItem: React$ComponentType<ListItemProps>
};

export type Props = {
	components: Components,
	onSelect: (item: Item) => void,
	options: Array<Item>,
	show: boolean
};
