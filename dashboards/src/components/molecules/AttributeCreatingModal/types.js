// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Option} from 'components/molecules/SourceControl/types';
import {TYPES} from './constants';

type SecondTemplateType =
	| typeof TYPES.CONSTANT
	| typeof TYPES.SOURCE
;

type ComputeData = {
	aggregation: string,
	attr: Attribute,
	dataKey: string
};

type ComputeDataMap = {
	[string]: ComputeData
};

export type ComputedAttr = {
	code: string,
	computeData: ComputeDataMap,
	state: string,
	stringForCompute: string,
	title: string,
	type: typeof ATTRIBUTE_TYPES.COMPUTED_ATTR
};

export type Control = {
	name: string,
	next: string,
	prev: string,
	type: string,
	value: null,
};

export type Props = {
	onClose: () => any,
	onRemove?: (code: string) => void,
	onSubmit: (attribute: ComputedAttr) => void,
	sources: Array<Option>,
	value: ComputedAttr | null
};

export type State = {
	controls: {
		[string]: Object
	},
	first: string,
	info: string,
	last: string,
	secondTemplateType: SecondTemplateType,
	showLegacyFormatInfo: boolean,
	showRemoveInfo: boolean,
	title: string
};
