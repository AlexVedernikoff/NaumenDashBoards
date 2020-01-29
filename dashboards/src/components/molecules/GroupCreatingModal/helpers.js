// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';
import uuid from 'tiny-uuid';

const createNewSubGroup = (id: string) => {
	const conditionId = uuid();

	return ({
		conditions: {
			first: conditionId,
			map: {
				[conditionId]: createNewCondition(conditionId)
			}
		},
		id,
		name: '',
		next: ''
	});
};

const createNewCondition = (id: string, next: string = '') => ({
	id,
	next,
	operand: {
		type: OPERAND_TYPES.BETWEEN,
		data: null
	},
	operator: null
});

export {
	createNewSubGroup,
	createNewCondition
};
