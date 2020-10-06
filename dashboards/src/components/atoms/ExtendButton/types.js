// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	active: boolean,
	className: string,
	iconName: IconName,
	onClick: () => void | Promise<void>,
	text: string,
};
