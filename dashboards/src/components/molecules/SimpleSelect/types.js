// @flow
import type {OnChangeInputEvent} from 'components/types';

export type Option = {
	label: string,
	value: any
};

export type Value = Option | string | number | null;

export type SelectEvent = {
	name: string,
	value: Value;
};

export type Props = {
	className: string,
	editable: boolean,
	name: string,
	onChangeLabel?: OnChangeInputEvent => void,
	onSelect: SelectEvent => void,
	options: Array<Option> | Array<string | number>,
	value: Value
};

export type State = {
	showMenu: boolean
};
