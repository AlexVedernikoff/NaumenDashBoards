// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	className: string,
	icon: IconName,
	onClick?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
	tip: React$Node
};
