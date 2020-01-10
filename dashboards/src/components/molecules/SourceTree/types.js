// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type Props = {
	className: string,
	onSelect: (value: SourceValue) => void | Promise<void>,
	sources: DataSourceMap,
	value: SourceValue | null,
}

export type State = {
	expanded: Array<string>,
	foundSources: Array<string>,
	searchValue: string
}
