// @flow
import type {SelectData, SelectOperand} from 'store/customGroups/types';

export type Props = {
	onChange: SelectOperand => void,
	onClickShowMore: () => void,
	operand: SelectOperand,
	options: Array<SelectData>,
	showMore: boolean,
};
