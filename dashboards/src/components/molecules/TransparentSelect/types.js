// @flow
import type {OnChangeLabelEvent, OnSelectEvent, SelectValue} from 'components/types';

export type Option = any;

export type Props = {
	className: string,
	disabled: boolean,
	getOptionLabel: (option: Option) => string,
	getOptionValue: (option: Option) => string,
	loading: boolean,
	name: string,
	note: string,
	onChangeLabel: OnChangeLabelEvent => void,
	onClickCreationButton: () => void,
	onRemove: (name: string) => void,
	onSelect: OnSelectEvent => void,
	options: Array<Option>,
	placeholder: string,
	removable: boolean,
	showCreationButton: boolean,
	value: SelectValue
};

export type State = {
	foundOptions: Array<Option>,
	searchValue: string,
	showForm: boolean,
	showMenu: boolean
};