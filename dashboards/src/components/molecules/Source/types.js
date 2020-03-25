// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {Source} from 'store/widgets/data/types';

export type OnSelectCallback = (index: number) => () => void;

export type Compute = {
	name: string,
	onChange: (name: string, value: boolean) => void,
	value: boolean
};

export type Descriptor = {
	name: string,
	onChange: (name: string, value: string) => void,
	value: string
};

export type Props = {
	compute: Compute,
	defaultValue: Source,
	descriptor: Descriptor,
	error: string,
	name: string,
	onChangeLabel: (name: string, value: Source) => void,
	onRemove: any,
	onSelect: (name: string, value: Source | null) => void | Promise<void>,
	onSelectCallback?: () => void,
	removable: boolean,
	sources: DataSourceMap,
	value: Source | null
};

export type State = {
	showForm: boolean,
	showList: boolean
};
