// @flow
import {batch} from 'react-redux';
import type {Dispatch, ThunkAction} from 'store/types';
import {fetchAttributes} from './attributes/actions';
import {fetchGroupsAttributes} from './attributesData/groupsAttributes/actions';

const fetchAttributesForFilters = (
	classFqn: string,
	parentClassFqn: ?string = null,
	attrGroupCode: string
): ThunkAction => async (dispatch: Dispatch) => {
	batch(() => {
		dispatch(fetchAttributes(classFqn, parentClassFqn));
		dispatch(fetchGroupsAttributes(classFqn, attrGroupCode));
	});
};

export {
	fetchAttributesForFilters
};
