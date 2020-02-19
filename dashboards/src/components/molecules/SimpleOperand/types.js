// @flow
import type {SimpleOperand, SimpleType} from 'store/customGroups/types';

export type Props = {
	data: string,
	float: boolean,
	onChange: SimpleOperand => void,
	onlyNumber: boolean,
	type: SimpleType
};
