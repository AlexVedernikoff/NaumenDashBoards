// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import type {CancelButtonProps, ContainerProps, ContentProps, FooterProps, HeaderProps, Props} from './types';
import cn from 'classnames';
import {isLegacyBrowser} from 'utils/export/helpers';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class WidgetForm extends PureComponent<Props> {
	static defaultProps = {
		components: {},
		updating: false
	};

	components = {
		CancelButton: this.renderCancelButton,
		Container: this.renderContainer,
		Content: this.renderContent,
		Footer: this.renderFooter,
		Header: this.renderHeader,
		SubmitButton: this.renderSubmitButton,
		Title: this.renderTitle
	};

	getComponents = () => {
		const {components} = this.props;
		return {...this.components, ...components};
	};

	renderCancelButton (props: CancelButtonProps) {
		const {className, onCancel} = props;

		return (
			<Button className={className} onClick={onCancel} variant={BUTTON_VARIANTS.ADDITIONAL}>
				Отмена
			</Button>
		);
	}

	renderContainer (props: ContainerProps) {
		const {children, className, forwardedRef} = props;

		return (
			<div className={className} ref={forwardedRef}>
				{children}
			</div>
		);
	}

	renderContent (props: ContentProps) {
		const {children, className} = props;

		return (
			<div className={className}>
				{children}
			</div>
		);
	}

	renderFooter (props: FooterProps) {
		const {children, className} = props;

		return (
			<div className={className}>
				{children}
			</div>
		);
	}

	renderHeader (props: HeaderProps) {
		const {children, className} = props;

		return (
			<div className={className}>
				{children}
			</div>
		);
	}

	renderSubmitButton (props: Object) {
		const {onSubmit, updating} = props;

		return (
			<Button disabled={updating} onClick={onSubmit} variant={BUTTON_VARIANTS.SIMPLE}>
				Сохранить
			</Button>
		);
	}

	renderTitle (props: Object) {
		const {children, className} = props;

		return (
			<div className={className}>{children}</div>
		);
	}

	render () {
		const {children, forwardedRef, onCancel, onSubmit, title, updating} = this.props;
		const {CancelButton, Container, Content, Footer, Header, SubmitButton, Title} = this.getComponents();
		const formCN = cn({
			[styles.form]: true,
			[styles.ieForm]: isLegacyBrowser(false)
		});

		return (
			<Container className={formCN} forwardedRef={forwardedRef}>
				<Header className={styles.header}>
					<Title className={styles.title}>{title}</Title>
				</Header>
				<Content className={styles.content}>{children}</Content>
				<Footer className={styles.footer}>
					<SubmitButton onSubmit={onSubmit} updating={updating}>Сохранить</SubmitButton>
					<CancelButton className={styles.cancelButton} onCancel={onCancel}>Отмена</CancelButton>
				</Footer>
			</Container>
		);
	}
}

export default WidgetForm;
