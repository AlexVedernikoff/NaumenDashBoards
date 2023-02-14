// @flow
import type {Node} from 'react';
import type {OnChangeInputEvent} from 'components/atoms/types';

export type Props = {
	checked: boolean,
	children: Node,
	name: string,
	onChange: OnChangeInputEvent => void,
	title: string,
	value: string
};
