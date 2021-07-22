// @flow
import type {IconName} from 'src/components/atoms/Icon/types';
import {VARIANTS} from './constants';

export type DefaultProps = {|
	active: boolean,
	className: string,
	round: boolean,
	tip: React$Node,
	variant: $Keys<typeof VARIANTS>
|};

export type Props = {
	...DefaultProps,
	icon: IconName,
	onClick?: (event: SyntheticMouseEvent<HTMLButtonElement>) => void
};
