// @flow
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from 'components/Modal/constants';
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

type FooterPosition = $Keys<typeof FOOTER_POSITIONS>;
type DefaultButtons = $Keys<typeof DEFAULT_BUTTONS>;

export type DefaultProps = {|
	cancelText: string,
	className: string,
	defaultButton: DefaultButtons,
	footerPosition: FooterPosition,
	notice: boolean,
	showCancelButton: boolean,
	size: Size | number,
	submitText: string,
	submitting: boolean
|};

export type Props = {
	...DefaultProps,
	header: string,
	onClose: () => void,
	onSubmit: () => void,
	renderFooter?: () => Node,
	text: Node | string
};
