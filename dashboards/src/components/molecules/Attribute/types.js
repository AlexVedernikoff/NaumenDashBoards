// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import type {Node} from 'react';
import type {Option as SourceOption} from 'components/molecules/SourceControl/types';
import type {RefInputType} from 'components/molecules/AttributeRefInput/types';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type OnSelectCallback = (name: string, value: Attribute) => void;

export type State = {
	showCreatingModal: boolean,
	showEditingModal: boolean
}

type refInputProps = {
	mixin?: Object,
	name: string,
	renderValue?: (props: RenderValueProps) => Node,
	type: RefInputType,
	value: string
}

type Option = Attribute | ComputedAttr;

export type Props = {
	computedAttrs?: Array<ComputedAttr>,
	getAttributeOptions: (classFqn: string) => Array<Attribute>,
	getRefAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	isDisabled: boolean,
	isRemovable: boolean,
	name: string,
	onChangeTitle: (name: string, value: Option) => void,
	onRemoveAttribute: (name: string, code: string) => void,
	onSaveAttribute: (name: string, value: ComputedAttr) => void,
	onSelect: (name: string, value: Option | null) => void,
	onSelectCallback?: OnSelectCallback,
	onSelectRefInput: (name: string, value: string) => void,
	refInputProps?: refInputProps,
	source: SourceValue,
	sources: Array<SourceOption>,
	value: Option | null,
	withCreate: boolean,
	onRemove: (name: string) => void,
	options: Array<Option>
};
