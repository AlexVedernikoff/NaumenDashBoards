// @flow
import type {Table} from 'src/store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: Table) => void,
	value: Table
};
