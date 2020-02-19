// @flow
import type {Data} from 'store/sources/attributesData/types';
import type {MultiSelectOperand} from 'store/customGroups/types';
import {OPERAND_TYPES} from 'store/customGroups/constants';

export type Props = {
	data: Array<Data>,
	onChange: MultiSelectOperand => void,
	onClickShowMore: () => void,
	options: Array<Data>,
	showMore: boolean,
	type: typeof OPERAND_TYPES.CONTAINS_ANY
};
