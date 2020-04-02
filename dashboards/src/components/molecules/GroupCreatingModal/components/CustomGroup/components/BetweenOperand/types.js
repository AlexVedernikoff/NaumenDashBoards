// @flow
import type {BetweenOperand} from 'store/customGroups/types';

export type Props = {
	onChange: BetweenOperand => void,
	operand: BetweenOperand,
};
