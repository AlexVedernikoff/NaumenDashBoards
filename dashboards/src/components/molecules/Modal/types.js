// @flow
import {FOOTER_POSITIONS, SIZES} from './constants';
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;

export type Props = {
	cancelText: string,
	children: Node,
	className: string,
	footerPosition: FooterPosition,
	header: string,
	notice: boolean,
	onClose?: () => void,
	onSubmit?: () => void,
	renderFooter?: () => Node,
	size: Size | number,
	submitText: string
};
