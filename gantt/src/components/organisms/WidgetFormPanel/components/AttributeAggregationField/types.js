// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Node} from 'react';
import type {RenderValueProps} from 'components/molecules//MiniSelect/types';

export type Props = {
	attribute: Attribute | null,
	onSelect: (name: string, value: string) => void,
	renderValue?: (props: RenderValueProps) => Node,
	usesNotApplicableAggregation: boolean,
	value: string
};
