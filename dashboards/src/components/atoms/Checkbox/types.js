// @flow
import {ACTIVE_COLORS} from './constants';

type ActiveColor =
	| typeof ACTIVE_COLORS.INFO
	| typeof ACTIVE_COLORS.LIGHT
;

export type Props = {
	activeColor: ActiveColor,
	className: string,
	label: string,
	name: string,
	onClick: (name: string, value: boolean) => void | Promise<void>,
	value: string
};
