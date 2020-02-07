// @flow
import {CONDITION_TYPES} from 'store/customGroups/constants';

const createNewSubGroup = () => ({
	data: [createNewAndCondition()],
	name: ''
});

const createNewAndCondition = () => ([createNewOrCondition()]);

const createNewOrCondition = () => ({
	data: null,
	type: CONDITION_TYPES.BETWEEN
});

export {
	createNewAndCondition,
	createNewOrCondition,
	createNewSubGroup
};
