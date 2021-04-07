// @flow
import type {Legend} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: Legend) => void,
	value: Legend,
};
