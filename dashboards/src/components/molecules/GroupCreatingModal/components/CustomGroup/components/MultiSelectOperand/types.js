// @flow
import type {MultiSelectOperand, SelectData} from 'store/customGroups/types';

type Data = {
	error: boolean,
	items: Array<SelectData>,
	loading: boolean
};

export type Props = {
	data: Data,
	onChange: MultiSelectOperand => void,
	onLoadData: () => void,
	operand: MultiSelectOperand
};
