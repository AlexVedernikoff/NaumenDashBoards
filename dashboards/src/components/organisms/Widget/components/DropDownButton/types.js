// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type MenuItem = {
	label: string,
	value: string
};

export type Props = {
	buttonIcon: IconName,
	className: string,
	menu: Array<MenuItem>,
	onSelect: (value: MenuItem) => void,
	round: boolean,
	tip: string,
	value: MenuItem
};

export type State = {
	showMenu: boolean
};
