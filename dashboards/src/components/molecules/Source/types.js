// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {TreeSelectValue} from 'components/molecules/TreeSelectInput/types';

export type OnSelectCallback = (name: string, value: TreeSelectValue) => void;

export type SourceValue = TreeSelectValue;

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
