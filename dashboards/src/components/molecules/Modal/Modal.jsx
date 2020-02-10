// @flow
import {Button} from 'components/atoms';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import {root} from 'src';
import {SIZES} from './constants';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Modal extends Component<Props> {
	static defaultProps = {
		cancelText: 'Отмена',
		children: null,
		size: SIZES.NORMAL,
		submitText: 'Сохранить'
	};

	getContainerCN = () => {
		const {size} = this.props;
		const {LARGE, SMALL} = SIZES;
		const classNames = [styles.container];

		if (size === LARGE) {
			classNames.push(styles.largeContainer);
		}

		if (size === SMALL) {
			classNames.push(styles.smallContainer);
		}

		return cn(classNames);
	};

	prevent = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	renderDefaultFooter = () => {
		const {cancelText, onClose, onSubmit, submitText} = this.props;

		return (
			<Fragment>
				<Button className={styles.submitButton} onClick={onSubmit}>{submitText}</Button>
				<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>{cancelText}</Button>
			</Fragment>
		);
	};

	renderModal = () => (
		<div className={styles.modal}>
			<div className={this.getContainerCN()} onClick={this.prevent}>
				{this.renderModalHeader()}
				{this.renderModalBody()}
				{this.renderModalFooter()}
			</div>
		</div>
	);

	renderModalBody = () => {
		const {children} = this.props;

		if (children) {
			return <div className={styles.content}>{children}</div>;
		}
	};

	renderModalFooter = () => {
		const {renderFooter} = this.props;

		return (
			<div className={styles.footer}>
				{renderFooter ? renderFooter() : this.renderDefaultFooter()}
			</div>
		);
	};

	renderModalHeader = () => <div className={styles.header}>{this.props.header}</div>;

	render () {
		return root ? createPortal(this.renderModal(), root) : null;
	}
}

export default Modal;
