// @flow
import {ICON_NAMES} from './constants';

export type IconName = $Keys<typeof ICON_NAMES>;

export type Props = {
	className: string,
	name: IconName,
	onClick?: () => void
};
