// @flow
import type {SourceItem} from 'store/App/types';

export type Props = {
	name: string,
	onChange: Function,
	options: Array<SourceItem>,
	value: SourceItem
};
