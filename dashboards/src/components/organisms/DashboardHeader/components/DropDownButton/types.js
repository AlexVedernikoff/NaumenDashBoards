// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type MenuItem = {
	label: string,
	value: string
};

export type Props = {
	name: IconName,
	menu: Array<MenuItem>,
	onSelect: (value: string) => Promise<void> | void,
	tip: string
};

export type State = {
	showMenu: boolean
};
