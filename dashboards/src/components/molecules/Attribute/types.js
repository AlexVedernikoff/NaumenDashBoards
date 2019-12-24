// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import type {RefInputType} from 'components/molecules/AttributeRefInput/types';
import type {SelectProps} from 'components/organisms/WidgetFormPanel/builders/FormBuilder/types';
import type {SourceValue} from 'components/molecules/Source/types';

export type OnSelectCallback = (name: string, value: Attribute) => void;

export type State = {
	showCreatingModal: boolean
}

type RefInput = {
	mixin?: Object,
	name: string,
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
	onCreateAttribute: (name: string, value: ComputedAttr) => void,
	onSelect: (name: string, value: Attribute | null) => void,
	onSelectCallback?: OnSelectCallback,
	onSelectRefInput: (name: string, value: string) => void,
	refInput?: RefInput,
	source: SourceValue,
	sources: Array<SourceValue>,
	withDivider?: boolean
} & SelectProps;
