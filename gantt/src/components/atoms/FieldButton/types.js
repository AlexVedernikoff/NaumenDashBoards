// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	disabled: boolean,
	onClick: () => void,
	tip: string
};
