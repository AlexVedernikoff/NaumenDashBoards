// @flow
import type {OnSelectEvent, SelectValue} from 'components/types';

type Options = {
	[string]: Object
};

export type OnChangeLabelEvent = {
	label: string,
	name: string
};

export type OnRemoveEvent = {
	name: string
};

export type Props = {
	getOptionLabel?: (option: SelectValue) => string,
	getOptionValue?: (option: SelectValue) => any,
	initialSelected: Array<string>,
	name: string,
	onChangeLabel: OnChangeLabelEvent => void,
	onRemove: OnRemoveEvent => void,
	onSelect: OnSelectEvent => void | Promise<void>,
	options: Options,
	placeholder: string,
	removable: boolean,
	value: SelectValue | null
};

export type State = {
	showForm: boolean,
	showList: boolean
};
