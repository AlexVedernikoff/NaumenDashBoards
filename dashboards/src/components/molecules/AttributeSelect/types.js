// @flow
import type {Attribute} from 'store/sources/attributes/types';

export type Props = {
	disabled: boolean,
	loading: boolean,
	name: string,
	note: string,
	onChangeTitle: (name: string, title: string) => void,
	onClickCreationButton: () => void,
	onRemove: (name: string) => void,
	onSelect: (name: string, value: Attribute | null) => void,
	options: Array<Attribute>,
	placeholder: string,
	removable: boolean,
	showCreationButton: boolean,
	value: Attribute | null
};

export type State = {
	foundOptions: Array<Attribute>,
	searchValue: string,
	showForm: boolean,
	showMenu: boolean
};
