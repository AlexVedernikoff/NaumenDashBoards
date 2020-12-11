// @flow

export type DefaultProps = {
	className: string
};

export type RequiredProps = {
	children: React$Node
};

export type Props = DefaultProps & RequiredProps;

export type ComponentProps = React$Config<RequiredProps, DefaultProps>;
