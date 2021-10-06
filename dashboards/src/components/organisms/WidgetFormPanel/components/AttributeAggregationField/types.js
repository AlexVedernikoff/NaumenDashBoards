// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {Node} from 'react';
import type {RenderValueProps} from 'components/molecules//MiniSelect/types';

export type AggrigationOption = {
	label: string,
	value: $Keys<typeof DEFAULT_AGGREGATION> | $Keys<typeof INTEGER_AGGREGATION>;
};

export type Props = {
	attribute: Attribute | null,
	name: string,
	onSelect: (name: string, value: string) => void,
	renderValue?: (props: RenderValueProps) => Node,
	usesNotApplicableAggregation: boolean,
	value: string
};

export type State = {
	options: Array<AggrigationOption>
};
