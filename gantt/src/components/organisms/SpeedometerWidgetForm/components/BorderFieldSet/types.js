// @flow
import type {Borders} from 'src/store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: Borders) => void,
	value: Borders
};
