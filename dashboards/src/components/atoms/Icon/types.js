// @flow
import {ICON_NAMES, ICON_SIZES} from './constants';

export type IconName = $Keys<typeof ICON_NAMES>;

export type Symbol = {
	id: IconName,
	content: string
};

export type Props = {
	className: string,
	name: IconName,
	onClick?: () => void,
	size: $Keys<typeof ICON_SIZES>
};
