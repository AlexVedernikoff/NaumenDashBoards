// @flow
import type {RangesStyle} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, data: RangesStyle) => void,
	value: RangesStyle,

};
