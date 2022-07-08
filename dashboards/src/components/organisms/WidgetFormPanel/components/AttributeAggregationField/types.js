// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';
import type {Node} from 'react';
import type {RenderValueProps} from 'components/molecules//MiniSelect/types';

export type AggregationOption = {
	label: string,
	value: $Values<typeof DEFAULT_AGGREGATION> | $Values<typeof INTEGER_AGGREGATION>;
};

export type Props = {
	attribute: Attribute | null,
	hasPercentAggregation: boolean,
	name: string,
	onSelect: (name: string, value: string) => void,
	renderValue?: (props: RenderValueProps) => Node,
	usesNotApplicableAggregation: boolean,
	value: string
};

export type State = {
	options: Array<AggregationOption>
};
