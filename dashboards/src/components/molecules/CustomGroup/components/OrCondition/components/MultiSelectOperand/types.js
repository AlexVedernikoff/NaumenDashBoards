// @flow
import type {Data} from 'store/sources/attributesData/types';
import type {MultiSelectOperand} from 'store/customGroups/types';

export type Props = {
	onChange: MultiSelectOperand => void,
	onClickShowMore: () => void,
	operand: MultiSelectOperand,
	options: Array<Data>,
	showMore: boolean
};
