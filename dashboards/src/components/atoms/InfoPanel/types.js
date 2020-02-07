// @flow
import {VARIANTS} from './constants';

export type Props = {
	className: string,
	onClose: () => void,
	onConfirm?: () => void | Promise<void>,
	text: string,
	variant: $Keys<typeof VARIANTS>
};
