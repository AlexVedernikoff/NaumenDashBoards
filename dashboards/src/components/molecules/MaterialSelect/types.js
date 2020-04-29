// @flow
import type {InputRef} from 'src/components/types';

export type Option = Object;

type Name = any;

export type Props = {
	async: boolean,
	focusOnSearch: boolean,
	forwardedLabelInputRef?: InputRef,
	getOptionLabel?: (option: Option) => string,
	getOptionValue?: (option: Option) => any,
	isEditingLabel: boolean,
	isSearching: boolean,
	loading: boolean,
	maxLabelLength: number,
	multiple: boolean,
	name: Name,
	onChangeLabel?: (name: Name, label: string) => void,
	onClear?: () => void,
	onClickCreationButton?: () => void,
	onLoadOptions?: () => void,
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
	optionsLoaded: boolean,
	showMenu: boolean
};
