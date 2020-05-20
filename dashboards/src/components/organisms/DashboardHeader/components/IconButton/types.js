// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	className: string,
	onClick?: () => void,
	name: IconName,
	tip: string
};
