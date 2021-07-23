// @flow
import type {IconName} from 'components/atoms/Icon/types';
import {VARIANTS} from './constants';

export type Props = {
	className: string,
	name: IconName,
	onClick?: () => void,
	outline: boolean,
	tip: string,
	variant: $Keys<typeof VARIANTS>
};
