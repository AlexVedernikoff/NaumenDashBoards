// @flow
import type {SelectData, SelectOperand, SelectType} from 'store/customGroups/types';

export type Props = {
	data: SelectData | null,
	onChange: SelectOperand => void,
	onClickShowMore: () => void,
	options: Array<SelectData>,
	showMore: boolean,
	type: SelectType
};
