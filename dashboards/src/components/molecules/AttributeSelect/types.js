// @flow
import type {Attribute} from 'store/sources/attributes/types';

export type Props = {
	defaultValue: Attribute,
	isDisabled: boolean,
	isRemovable: boolean,
	name: string,
	onChangeTitle: (name: string, title: string) => void,
	onClickCreationButton: () => void,
	onRemove: (name: string) => void,
	onSelect: (name: string, value: Attribute | null) => void,
	options: Array<Attribute>,
	placeholder: string,
	showCreationButton: boolean,
	value: Attribute | null
}

export type State = {
	foundOptions: Array<Attribute>,
	searchValue: string,
	showForm: boolean,
	showMenu: boolean
};
