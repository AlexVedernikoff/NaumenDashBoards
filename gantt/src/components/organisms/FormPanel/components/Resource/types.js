// @flow
import type {SourceItem} from 'store/App/types';

export type Props = {
	handleAddNewBlock: Function,
	level: number,
	onChange: Function,
	options: Array<SourceItem>,
	value: SourceItem
};
