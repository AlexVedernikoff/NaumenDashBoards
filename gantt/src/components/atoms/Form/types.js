// @flow
import type {Node} from 'react';

type Size = $Keys<typeof SIZES>;

export type DefaultProps = {|
	cancelText: string,
	children: ?Node,
	className: string,
	notice: boolean,
	showCancelButton: boolean,
	size: Size | number,
	submitText: string,
	submitting: boolean,
	top: number
|};

export type Props = {
	...DefaultProps,
	header?: string,
	onClose?: () => void,
	onSubmit?: () => void,
	renderFooter?: () => Node,
};
