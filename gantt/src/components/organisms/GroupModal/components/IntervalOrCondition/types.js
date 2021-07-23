// @flow
import type {IntervalData} from 'store/customGroups/types';
import type {Option} from 'GroupModal/types';

type IntervalOrCondition = {
	data: IntervalData,
	type: string
};

export type Props = {
	data: IntervalData,
	onChange: IntervalOrCondition => void,
	options: Array<Option>,
	type: string
};

export type State = {
	value: Option
};
