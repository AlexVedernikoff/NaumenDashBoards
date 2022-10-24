// @flow
import {ICON_NAMES} from './constants';

export type IconName = $Keys<typeof ICON_NAMES>;

export type Symbol = {
	content: string,
	id: IconName
};

export type Props = {
	className: string,
	fill: ?string,
	height: number,
	name: IconName,
	onClick?: (e: SyntheticMouseEvent<HTMLElement>) => void,
	title: string,
	viewBox: string,
	width: number
};
