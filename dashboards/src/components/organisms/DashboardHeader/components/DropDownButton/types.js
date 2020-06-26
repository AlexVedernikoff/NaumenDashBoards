// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type MenuItem = {
	label: string,
	value: string
};

export type Props = {
	menu: Array<MenuItem>,
	name: IconName,
	onSelect: (value: string) => Promise<void> | void,
	tip: string
};

export type State = {
	showMenu: boolean
};
