// @flow
import {Button} from 'components/atoms';
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {Component} from 'react';
import {root} from 'src';
import styles from './styles.less';

export class Modal extends Component<Props> {
	renderModal = () => {
		const {children, header, onClose, onSubmit} = this.props;

		return (
			<div className={styles.modal}>
				<div className={styles.container}>
					<div className={styles.header}>{header}</div>
					<div className={styles.content}>{children}</div>
					<div className={styles.footer}>
						<Button className={styles.submitButton} onClick={onSubmit}>Сохранить</Button>
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
