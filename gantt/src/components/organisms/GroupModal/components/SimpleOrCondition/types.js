// @flow
import type {OrCondition} from 'GroupModal/types';

type SimpleOrCondition = {
	data: string,
	type: string
};

export type Props = {
	float: boolean,
	onChange: SimpleOrCondition => void,
	onlyNumber: boolean,
	value: OrCondition | SimpleOrCondition
};
