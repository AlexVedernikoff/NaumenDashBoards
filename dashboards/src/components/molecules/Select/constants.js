// @flow
import type {DefaultProps} from './types';
import {getOptionLabel, getOptionValue, getOptions} from './helpers';

export const DEFAULT_PROPS: DefaultProps = {
	className: '',
	disabled: false,
	editable: false,
	getOptionLabel,
	getOptionValue,
	getOptions,
	isSearching: false,
	loading: false,
	loadingMessage: 'Select::LoadingMessage',
	menuHeaderMessage: null,
	multiple: false,
	name: '',
	noOptionsMessage: 'Select::NoOptionsMessage',
	notFoundMessage: 'Select::NotFoundMessage',
	options: [],
	placeholder: '',
	value: null,
	values: []
};
