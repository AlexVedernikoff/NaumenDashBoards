// @flow
import type {Props as HeaderProps} from './components/Header/types';
import type {Props as ListProps} from './components/List/types';
import type {Props as ListItemProps} from './components/ListItem/types';

type Components = $Shape<{
	Header: React$ComponentType<HeaderProps>,
	List: React$ComponentType<ListProps>,
	ListItem: React$ComponentType<ListItemProps>
}>;

export type Props = {
	components: Components,
	expand: boolean,
	onSelect: (item: Object) => void,
	options: Array<Object>,
	title: string
};

export type State = {
	showList: boolean
};
