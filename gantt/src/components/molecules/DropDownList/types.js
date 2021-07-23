// @flow
import type {Props as HeaderProps} from './components/Header/types';
import type {Props as ListProps} from './components/List/types';
import type {Props as ListItemProps} from './components/ListItem/types';
import type {Root, Value} from 'components/molecules/MultiDropDownList/types';

type Components = $Shape<{
	Header: React$ComponentType<HeaderProps>,
	List: React$ComponentType<ListProps>,
	ListItem: React$ComponentType<ListItemProps>
}>;

export type Props = {
	components: Components,
	expand: boolean,
	onSelect: (value: Value) => void,
	value: Root
};

export type State = {
	showList: boolean
};
