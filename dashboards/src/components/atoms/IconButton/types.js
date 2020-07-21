// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	active: boolean,
	className: string,
	icon: IconName,
	onClick?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
	round: boolean,
	tip: React$Node
};
