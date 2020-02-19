// @flow
import type {BetweenData, BetweenOperand} from 'store/customGroups/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';

export type Props = {
	data: BetweenData,
	onChange: BetweenOperand => void,
	type: typeof OPERAND_TYPES.BETWEEN
};
