// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import type {Node} from 'react';
import type {Option} from 'components/molecules/SourceControl/types';
import type {RefInputType} from 'components/molecules/AttributeRefInput/types';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import type {SelectProps} from 'components/organisms/WidgetFormPanel/builders/FormBuilder/types';
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

export type Props = {
	computedAttrs?: Array<ComputedAttr>,
	error: string,
	getAttributeOptions: (classFqn: string) => Array<Attribute>,
	getRefAttributeOptions: (attribute: Attribute) => Array<Attribute>,
	isRemovable: boolean,
	onChangeTitle: (name: string, value: Attribute) => void,
	onRemoveAttribute: (name: string, code: string) => void,
	onSaveAttribute: (name: string, value: ComputedAttr) => void,
	onSelect: (name: string, value: Attribute | null) => void,
	onSelectCallback?: OnSelectCallback,
	onSelectRefInput: (name: string, value: string) => void,
	refInputProps?: refInputProps,
	source: SourceValue,
	sources: Array<Option>,
	withDivider?: boolean
} & SelectProps;
