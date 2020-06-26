// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	className: string,
	name: IconName,
	onClick?: () => void,
	tip: string
};
