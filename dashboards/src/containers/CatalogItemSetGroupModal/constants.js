// @flow
import type {CatalogItemSetData} from 'store/sources/attributesData/catalogItemSets/types';
import {createContext} from 'react';
import type {LangType} from 'localization/localize_types';
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
		label: 'GroupModal::TitleContains',
		value: OR_CONDITION_TYPES.TITLE_CONTAINS
	},
	{
		label: 'GroupModal::TitleNotContains',
		value: OR_CONDITION_TYPES.TITLE_NOT_CONTAINS
	},
	{
		label: 'GroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'GroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::ContainsAttrCurrentObject',
		value: OR_CONDITION_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const DEFAULT_DATA = {
	error: false,
	items: {},
	loading: false
};

const DATA_CONTEXT = createContext<CatalogItemSetData>(DEFAULT_DATA);

DATA_CONTEXT.displayName = 'DATA_CONTEXT';

export {
	DATA_CONTEXT,
	DEFAULT_DATA,
	OR_CONDITION_OPTIONS
};
