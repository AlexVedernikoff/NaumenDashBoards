// @flow
import {FOOTER_POSITIONS, SIZES} from './constants';
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;

export type DefaultProps = {|
	cancelText: string,
	children: ?Node,
	className: string,
	footerPosition: FooterPosition,
	notice: boolean,
	showCancelButton: boolean,
	size: Size | number,
	submitText: string
|};

export type Props = {
	...DefaultProps,
	header: string,
	onClose?: () => void,
	onSubmit?: () => void,
	renderFooter?: () => Node,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
