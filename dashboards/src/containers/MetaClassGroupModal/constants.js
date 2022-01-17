// @flow
import {createContext} from 'react';
import type {LangType} from 'localization/localize_types';
import type {MetaClassData} from 'store/sources/attributesData/metaClasses/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'GroupModal::Contains',
		value: OR_CONDITION_TYPES.CONTAINS
	},
	{
		label: 'GroupModal::NotContains',
		value: OR_CONDITION_TYPES.NOT_CONTAINS
	},
	{
		label: 'GroupModal::ContainsAny',
		value: OR_CONDITION_TYPES.CONTAINS_ANY
	},
	{
		label: 'GroupModal::TitleContains',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'GroupModal::TitleNotContains',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::EqualAttrCurrentObject',
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
