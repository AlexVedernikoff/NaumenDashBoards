// @flow
import type {IconName} from 'components/atoms/Icon/types';

export type DefaultProps = {
	iconName: IconName,
	round: boolean
};

export type RequiredProps = {
	onClick: (event: SyntheticMouseEvent<HTMLButtonElement>) => void
};

export type Props = RequiredProps & DefaultProps;

export type ComponentProps = React$Config<RequiredProps, DefaultProps>;
