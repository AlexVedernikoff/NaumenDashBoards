// @flow
import type {DivRef} from 'components/types';

export type CancelButtonProps = {
	className: string,
	onCancel?: () => void
};

export type ContainerProps = {
	children: React$Node,
	className: string,
	forwardedRef?: DivRef
};

export type ContentProps = {
	children: React$Node,
	className: string
};

export type FooterProps = {
	children: React$Node,
	className: string
};

export type HeaderProps = {
	children: React$Node,
	className: string
};

export type SubmitButtonProps = {
	onSubmit: () => void
};

export type TitleProps = {
	children: React$Node,
	className: string
};

type Components = $Shape<{
	CancelButton: React$ComponentType<CancelButtonProps>,
	Container: React$ComponentType<ContainerProps>,
	Content: React$ComponentType<ContainerProps>,
	Footer: React$ComponentType<FooterProps>,
	Header: React$ComponentType<HeaderProps>,
	SubmitButton: React$ComponentType<SubmitButtonProps>,
	Title: React$ComponentType<TitleProps>,
}>;

export type Props = {
	children: React$Node,
	components: Components,
	forwardedRef?: DivRef,
	onCancel?: () => any,
	onSubmit: () => void,
	title: string,
	updating: boolean
};
