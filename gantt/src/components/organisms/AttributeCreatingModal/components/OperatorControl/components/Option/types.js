// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	icon: IconName,
	onClick: (value: string) => void,
	value: string
};
