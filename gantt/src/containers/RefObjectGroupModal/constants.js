// @flow
import {createContext} from 'react';
import {createSchema, string} from 'GroupModal/schema';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const OR_CONDITION_TYPE_CONTEXT = createContext('');

OR_CONDITION_TYPE_CONTEXT.displayName = 'OR_CONDITION_TYPE_CONTEXT';

const SCHEMA = createSchema((condition: OrCondition) => {
	const {TITLE_CONTAINS, TITLE_NOT_CONTAINS} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case TITLE_CONTAINS:
		case TITLE_NOT_CONTAINS:
			return string().isString();
	}
});

export {
	OR_CONDITION_TYPE_CONTEXT,
	SCHEMA
};
