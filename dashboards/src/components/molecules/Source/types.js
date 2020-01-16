// @flow
import type {DataSourceMap} from 'store/sources/data/types';

export type SourceValue = {
	label: string,
	value: string
};

export type OnSelectCallback = (name: string, value: SourceValue) => void;

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
	defaultValue: SourceValue,
	descriptor: Descriptor,
	error: string,
	isRemovable: boolean,
	name: string,
	onChangeLabel: (name: string, value: SourceValue) => void,
	onRemove: any,
	onSelect: (name: string, value: SourceValue | null) => void | Promise<void>,
	onSelectCallback?: OnSelectCallback,
	sources: DataSourceMap,
	value: SourceValue | null
};

export type State = {
	showForm: boolean,
	showList: boolean
};
