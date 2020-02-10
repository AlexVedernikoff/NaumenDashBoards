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
	showCreatingModal: boolean
};

export type RefInputProps = {
	disabled?: boolean,
	name: string,
	onSelectCallback?: (name: string, value: Object) => void,
	renderValue?: (props: RenderValueProps) => Node,
	type: $Keys<typeof REF_INPUT_TYPES>,
	value: string
};

export type AttributeValue = Attribute | ComputedAttr;

export type Props = {
	computedAttrs?: Array<ComputedAttr>,
	disabled: boolean,
	getAttributeOptions: (classFqn: string) => Array<Attribute>,
	getRefAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	name: string,
	onChangeTitle: (name: string, value: AttributeValue) => void,
	onRemove: (name: string) => void,
	onRemoveAttribute: (name: string, code: string) => void,
	onSaveComputedAttribute: (name: string, value: ComputedAttr) => void,
	onSelect: (name: string, value: AttributeValue | null) => void,
	onSelectCallback?: OnSelectCallback,
	onSelectRefInput: (name: string, value: any) => void,
	options: Array<AttributeValue>,
	refInputProps?: RefInputProps,
	removable: boolean,
	source: SourceValue,
	sources: Array<SourceOption>,
	value: AttributeValue | null,
	withCreate: boolean,
};
