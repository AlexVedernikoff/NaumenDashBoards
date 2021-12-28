// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type Props = {
	active: boolean,
	icon: IconName,
	onClick: ?() => void,
	text: string
};
