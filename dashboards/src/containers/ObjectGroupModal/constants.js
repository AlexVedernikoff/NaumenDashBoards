// @flow
import {createContext} from 'react';
import type {LangType} from 'localization/localize_types';
import type {ObjectsState} from 'src/store/sources/attributesData/objects/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OBJECT_OR_CONDITION_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
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
		label: 'GroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'GroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	},
	{
		label: 'GroupModal::ContainsIncludingArchival',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'GroupModal::NotContainsIncludingArchival',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::EqualCurrentObject',
		value: OR_CONDITION_TYPES.EQUAL_CURRENT_OBJECT
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::EqualAttrCurrentObject',
		value: OR_CONDITION_TYPES.EQUAL_ATTR_CURRENT_OBJECT
	}
];

const BO_LINKS_OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
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
		label: 'GroupModal::ContainsIncludingArchival',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'GroupModal::NotContainsIncludingArchival',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'GroupModal::ContainsIncludingNested',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_NESTED
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::ContainsCurrentObject',
		value: OR_CONDITION_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::ContainsAttrCurrentObject',
		value: OR_CONDITION_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const BACK_BO_LINKS_OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
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
		label: 'GroupModal::ContainsIncludingArchival',
		value: OR_CONDITION_TYPES.CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		label: 'GroupModal::NotContainsIncludingArchival',
		value: OR_CONDITION_TYPES.NOT_CONTAINS_INCLUDING_ARCHIVAL
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::ContainsCurrentObject',
		value: OR_CONDITION_TYPES.CONTAINS_CURRENT_OBJECT
	},
	{
		hasReferenceToCurrentObject: true,
		label: 'GroupModal::ContainsAttrCurrentObject',
		value: OR_CONDITION_TYPES.CONTAINS_ATTR_CURRENT_OBJECT
	}
];

const DEFAULT_DATA = {
	actual: {},
	all: {},
	found: {}
};

const DATA_CONTEXT = createContext<ObjectsState>(DEFAULT_DATA);

DATA_CONTEXT.displayName = 'DATA_CONTEXT';

export {
	BACK_BO_LINKS_OR_CONDITION_OPTIONS,
	BO_LINKS_OR_CONDITION_OPTIONS,
	DATA_CONTEXT,
	DEFAULT_DATA,
	OBJECT_OR_CONDITION_OPTIONS
};
