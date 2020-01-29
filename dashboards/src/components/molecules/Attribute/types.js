// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import type {Node} from 'react';
import type {Option as SourceOption} from 'components/molecules/SourceControl/types';
import {REF_INPUT_TYPES} from './constants';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type OnSelectCallback = (name: string, value: Attribute) => void;

export type State = {
	showAggregationCreatingModal: boolean,
	showAggregationEditingModal: boolean,
	showGroupModal: boolean
};

export type RefInputProps = {
	mixin?: Object,
	name: string,
	renderValue?: (props: RenderValueProps) => Node,
	type: $Keys<typeof REF_INPUT_TYPES>,
	value: string
};

export type RefButtonProps = {
	content: Node,
	onClick: () => void,
	tip: string
};

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
	onSelectRefInput: (name: string, value: any) => void,
	refInputProps?: RefInputProps,
	source: SourceValue,
	sources: Array<SourceOption>,
	value: Option | null,
	withCreate: boolean,
	onRemove: (name: string) => void,
	options: Array<Option>
};
