// @flow
import type {IntervalData} from 'store/customGroups/types';
import type {Option} from 'GroupModal/types';

type IntervalArrayOrCondition = {
	data: Array<IntervalData>,
	type: string
};

export type Props = {
	data: Array<IntervalData>,
	onChange: IntervalArrayOrCondition => void,
	options: Array<Option>,
	type: string
};
