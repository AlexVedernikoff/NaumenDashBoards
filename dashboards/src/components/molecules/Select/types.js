// @flow
import type {OnChangeInputEvent} from 'components/types';

export type Option = Object;

export type Value = Option | string | number | null;

export type SelectEvent = {
	name: string,
	value: Value;
};

export type Props = {
	async: boolean,
	className: string,
	disabled: boolean,
	editable: boolean,
	error: boolean,
	fetchOptions?: () => any,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isSearching: boolean,
	loading: boolean,
	name: string,
	onChangeLabel?: OnChangeInputEvent => void,
	onClickCreationButton?: () => void,
	onSelect: SelectEvent => void,
	options: Array<Option>,
	showCreationButton: boolean,
	textCreationButton: string,
	uploaded: boolean,
	value: Value
};

export type State = {
	showMenu: boolean
};
