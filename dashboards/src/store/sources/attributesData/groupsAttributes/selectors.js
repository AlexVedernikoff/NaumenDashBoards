// @flow
import type {AppState} from 'store/types';
import {getGroupAttrKey} from './helpers';
import type {GroupsAttributesData, GroupsAttributesState} from './types';

const getGroupsAttributesState = (state: AppState): GroupsAttributesState => state.sources.attributesData.groupsAttributes;

const getGroupsAttributes = (state: AppState, classFqn: string, attrGroupCode: string | null): ?GroupsAttributesData => {
	const {groupsAttributes} = state.sources.attributesData;
	const key = getGroupAttrKey(classFqn, attrGroupCode);
	return groupsAttributes[key];
};

export {
	getGroupsAttributesState,
	getGroupsAttributes
};
