// @flow
import {Button} from 'components/atoms';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {Component} from 'react';
import {root} from 'src';
import {SIZES} from './constants';
import styles from './styles.less';

export class Modal extends Component<Props> {
	static defaultProps = {
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

	renderModal = () => {
		const {children, header, onClose, onSubmit, submitText} = this.props;

		return (
			<div className={styles.modal} onClick={onClose}>
				<div className={this.getContainerCN()} onClick={this.prevent}>
					<div className={styles.header}>{header}</div>
					{children && <div className={styles.content}>{children}</div>}
					<div className={styles.footer}>
						<Button className={styles.submitButton} onClick={onSubmit}>{submitText}</Button>
						<Button outline onClick={onClose}>Отмена</Button>
					</div>
				</div>
			</div>
		);
	};

	render () {
		return root ? createPortal(this.renderModal(), root) : null;
	}
}

export default Modal;
