// @flow
import {createContext} from 'react';
import type {MetaClassData} from 'store/sources/attributesData/metaClasses/types';
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
		hasReferenceToCurrentObject: true,
		label: 'Равно атрибуту текущего объекта',
		value: OR_CONDITION_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

const DEFAULT_DATA = {
	error: false,
	items: [],
	loading: false
};

const DATA_CONTEXT = createContext<MetaClassData>(DEFAULT_DATA);

DATA_CONTEXT.displayName = 'DATA_CONTEXT';

export {
	DATA_CONTEXT,
	DEFAULT_DATA,
	OR_CONDITION_OPTIONS
};
