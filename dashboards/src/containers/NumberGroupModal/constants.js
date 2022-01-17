// @flow
import type {LangType} from 'localization/localize_types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_OPTIONS: Array<{label: LangType, value: string}> = [
	{
		label: 'GroupModal::Equal',
		value: OR_CONDITION_TYPES.EQUAL
	},
	{
		label: 'GroupModal::NotEqual',
		value: OR_CONDITION_TYPES.NOT_EQUAL
	},
	{
		label: 'GroupModal::NotEqualNotEmpty',
		value: OR_CONDITION_TYPES.NOT_EQUAL_NOT_EMPTY
	},
	{
		label: 'GroupModal::Greater',
		value: OR_CONDITION_TYPES.GREATER
	},
	{
		label: 'GroupModal::Less',
		value: OR_CONDITION_TYPES.LESS
	},
	{
		label: 'GroupModal::Empty',
		value: OR_CONDITION_TYPES.EMPTY
	},
	{
		label: 'GroupModal::NotEmpty',
		value: OR_CONDITION_TYPES.NOT_EMPTY
	}
];

export {
	OR_CONDITION_OPTIONS
};
