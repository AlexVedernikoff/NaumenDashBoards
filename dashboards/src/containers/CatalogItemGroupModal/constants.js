// @flow
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import {createContext} from 'react';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS = [
	{
		label: 'Содержит',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'Не содержит',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'Содержит любое из значений',
		value: OR_CONDITION_TYPES.CONTAINS_ANY
	},
	{
		label: 'Название содержит',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'Название не содержит',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'пусто',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'не пусто',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		label: 'Равно атрибуту текущего объекта',
		value: OR_CONDITION_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

const DEFAULT_DATA = {
	error: false,
	items: {},
	loading: false
};

const DATA_CONTEXT = createContext<CatalogItemSetData>(DEFAULT_DATA);

export {
	DATA_CONTEXT,
	DEFAULT_DATA,
	OR_CONDITION_OPTIONS
};
