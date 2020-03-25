// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {Source} from 'store/widgets/data/types';

export type Props = {
	className: string,
	onSelect: (value: Source) => void | Promise<void>,
	sources: DataSourceMap,
	value: Source | null,
};

export type State = {
	expanded: Array<string>,
	foundSources: Array<string>,
	searchValue: string
};
