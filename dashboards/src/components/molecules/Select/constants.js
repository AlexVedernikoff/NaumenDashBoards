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
	loadingMessage: 'Загрузка...',
	multiple: false,
	name: '',
	noOptionsMessage: 'Список пуст',
	notFoundMessage: 'Ничего не найдено',
	options: [],
	placeholder: '',
	value: null
};
