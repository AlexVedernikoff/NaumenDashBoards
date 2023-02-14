// @flow
import type {Node} from 'react';

export type DefaultProps = {|
	cancelText: string,
	children: ?Node,
	className: string,
	notice: boolean,
	showCancelButton: boolean,
	submitText: string,
	submitting: boolean
|};

export type Props = {
	...DefaultProps,
	onClose?: () => void,
	onSubmit?: () => void
};
