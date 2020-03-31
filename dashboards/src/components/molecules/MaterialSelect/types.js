// @flow
import type {InputRef} from 'src/components/types';

export type Option = Object;

type Name = any;

export type Props = {
	focusOnSearch: boolean,
	forwardedLabelInputRef?: InputRef,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isEditingLabel: boolean,
	isSearching: boolean,
	multiple: boolean,
	name: Name,
	onChangeLabel?: (name: Name, label: string) => void,
	onClear?: () => void,
	onClickCreationButton?: () => void,
	onRemove?: (value: string) => void,
	onSelect: (name: Name, value: Option) => void,
	options: Array<Option>,
	placeholder: string,
	showCreationButton: boolean,
	textCreationButton: string,
	value: Option | null,
	values: Array<Option>
};

export type State = {
	showMenu: boolean
};
