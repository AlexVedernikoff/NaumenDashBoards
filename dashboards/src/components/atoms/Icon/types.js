// @flow
import {ICON_NAMES, ICON_SIZES} from './constants';

export type IconName = $Keys<typeof ICON_NAMES>;

export type Symbol = {
	content: string,
	id: IconName
};

export type Props = {
	className: string,
	name: IconName,
	onClick?: () => void,
	size: $Keys<typeof ICON_SIZES>,
	title: string
};
