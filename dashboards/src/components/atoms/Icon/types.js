// @flow
import {ICON_NAMES} from './constants';

export type Props = {
	className: string,
	name: $Keys<typeof ICON_NAMES>,
	onClick?: () => void
};
