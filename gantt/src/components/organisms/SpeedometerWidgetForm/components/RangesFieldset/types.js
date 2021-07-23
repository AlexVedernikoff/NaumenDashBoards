// @flow
import type {Ranges} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: Ranges) => void,
	value: Ranges
};
