// @flow
import {Button} from 'naumen-common-components';
import cn from 'classnames';
import {container} from 'app.constants';
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Modal extends Component<Props> {
	static defaultProps = {
		cancelText: 'Отмена',
		children: null,
		className: '',
		notice: false,
		showCancelButton: true,
		submitText: 'Ок',
		submitting: false
	};

	getContainerCN = () => {
		const {className, notice} = this.props;

		return cn({
			[className]: true,
			[styles.container]: true,
			[styles.error]: !notice
		});
	};

	prevent = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	renderCancelButton = () => {
		const {cancelText, notice, onClose, showCancelButton} = this.props;

		if (showCancelButton) {
			return (
				<Button className={styles.cancelButton} onClick={onClose} outline={notice} variant={notice ? 'INFO' : 'SIMPLE'}>
					{cancelText}
				</Button>
			);
		}

		return null;
	};

	renderModal = () => {
		return (
			<div className={styles.modal}>
				<div className={this.getContainerCN()} onClick={this.prevent}>
					{this.renderModalButtons()}
					{this.renderModalBody()}
				</div>
			</div>
		);
	};

	renderModalBody = () => {
		const {children, notice} = this.props;
		const contentCN = cn({
			[styles.content]: true,
			[styles.noticeContent]: notice
		});

		if (children) {
			return <div className={contentCN}>{children}</div>;
		}
	};

	renderModalButtons = () => {
		const {notice} = this.props;
		const contentCN = cn({
			[styles.buttonGroup]: true,
			[styles.errorButtonGroup]: !notice
		});

		return (
			<div className={contentCN}>
				{this.renderSubmitButton()}
				{this.renderCancelButton()}
			</div>
		);
	};

	renderSubmitButton = () => {
		const {notice, onSubmit, submitText, submitting} = this.props;

		return (
			<Button disabled={submitting} onClick={onSubmit} outline={notice} variant="INFO">
				{submitText}
			</Button>
		);
	};

	render () {
		return container ? createPortal(this.renderModal(), container) : null;
	}
}

export default Modal;
