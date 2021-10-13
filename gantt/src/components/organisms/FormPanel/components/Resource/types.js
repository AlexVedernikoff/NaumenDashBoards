// @flow
import type {ResourceSetting, SourceItem} from 'store/App/types';

export type Props = {
	handleAddNewBlock: (value: string) => void,
	level: number,
	onChange: (value: ResourceSetting) => void,
	options: Array<SourceItem>,
	value: SourceItem
};
