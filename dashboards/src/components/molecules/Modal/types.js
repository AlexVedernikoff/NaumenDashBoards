// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	header: string,
	onClose: () => any,
	onSubmit: () => any
}
