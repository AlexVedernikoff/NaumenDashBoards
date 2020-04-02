// @flow
import type {SimpleOperand} from 'store/customGroups/types';

export type Props = {
	float: boolean,
	onChange: SimpleOperand => void,
	onlyNumber: boolean,
	operand: SimpleOperand
};
