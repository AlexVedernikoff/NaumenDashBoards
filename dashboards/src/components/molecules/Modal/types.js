// @flow
import {FOOTER_POSITIONS, SIZES} from './constants';
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;

export type Props = {
	cancelText: string,
	children: Node,
	footerPosition: FooterPosition,
	header: string,
	onClose?: () => void,
	onSubmit?: () => void,
	renderFooter?: () => Node,
	size: Size | number,
	submitText: string
};
