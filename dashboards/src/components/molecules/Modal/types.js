// @flow
import type {Node} from 'react';
import {SIZES} from './constants';

type Size =
	| typeof SIZES.LARGE
	| typeof SIZES.NORMAL
	| typeof SIZES.SMALL
;

export type Props = {
	children: Node,
	header: string,
	onClose: () => void,
	onSubmit: () => void,
	size: Size,
	submitText: string
}
