// @flow
import type {SelectData, SelectOperand} from 'store/customGroups/types';

type Data = {
	error: boolean,
	items: Array<SelectData>,
	loading: boolean
};

export type Props = {
	data: Data,
	onChange: SelectOperand => void,
	onLoadData: () => void,
	operand: SelectOperand
};
