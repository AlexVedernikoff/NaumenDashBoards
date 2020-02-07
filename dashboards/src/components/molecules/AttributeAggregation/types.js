// @flow
import type {AttributeValue} from 'components/molecules/Attribute/types';
import type {Node} from 'react';
import type {RenderValueProps} from 'components/molecules//MiniSelect/types';

export type Props = {
	attribute: AttributeValue | null,
	name: string,
	onSelect: (name: string, value: string) => void,
	renderValue?: (props: RenderValueProps) => Node,
	value: string
};
