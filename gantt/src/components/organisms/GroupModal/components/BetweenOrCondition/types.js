// @flow
import type {BetweenData} from 'src/store/customGroups/types';

type BetweenOrCondition = {
	data: BetweenData,
	type: string
};

export type Props = {
	data: BetweenData,
	onChange: BetweenOrCondition => void,
	type: string
};
