// @flow
import type {IntervalOperand} from 'store/customGroups/types';

export type Props = {
	onChange: IntervalOperand => void,
	operand: IntervalOperand
};
