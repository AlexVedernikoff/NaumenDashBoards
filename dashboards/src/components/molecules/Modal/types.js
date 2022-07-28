// @flow
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from './constants';
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;
type DefaultButtons = $Keys<typeof DEFAULT_BUTTONS>;

export type DefaultProps = {|
	cancelText: string,
	children: ?Node,
	className: string,
	defaultButton: DefaultButtons,
	footerPosition: FooterPosition,
	notice: boolean,
	setBlurRoot: (value: boolean) => void,
	showCancelButton: boolean,
	size: Size | number,
	submitText: string,
	submitting: boolean
|};

export type Props = {
	...DefaultProps,
	header: string,
	onClose?: () => void,
	onSubmit?: () => void,
	renderFooter?: () => Node,
};

export type ComponentProps = React$Config<Props, DefaultProps>;
