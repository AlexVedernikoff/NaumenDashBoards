// @flow
import type {Table} from 'store/widgets/data/types';

export type Props = {
	data: Table,
	name: string,
	onChange: (name: string, data: Table) => void
};
