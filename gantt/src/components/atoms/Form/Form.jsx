// @flow
import {Button} from 'naumen-common-components';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Form extends Component<Props> {
	static defaultProps = {
		cancelText: 'Отмена',
		children: null,
		className: '',
		notice: false,
		showCancelButton: true,
		submitText: 'Сохранить',
		submitting: false
	};

	getContainerCN = () => {
		const {className} = this.props;

		return cn({
			[className]: true,
			[styles.form]: true
		});
	};

	prevent = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	renderBody = () => {
		const {children, notice} = this.props;
		const contentCN = cn({
			[styles.content]: true,
			[styles.noticeContent]: notice
		});

		if (children) {
			return <div className={contentCN}>{children}</div>;
		}
	};

	renderCancelButton = () => {
		const {cancelText, onClose, showCancelButton} = this.props;

		if (showCancelButton) {
			return (
				<Button onClick={onClose} outline={true} variant='INFO'>
					{cancelText}
				</Button>
			);
		}

		return null;
	};

	renderForm = () => {
		const {size, top} = this.props;
		const width = Number.isInteger(size) && size;

		return (
			<div className={this.getContainerCN()} onClick={this.prevent} style={{top: top - 52, width}}>
				{this.renderHeader()}
				{this.renderBody()}
			</div>
		);
	};

	renderHeader = () => {
		const {header} = this.props;

		return (
			<div className={styles.header}>
				{header}
				<div className={styles.buttonGroup}>
					{this.renderCancelButton()}
					{this.renderSubmitButton()}
				</div>
			</div>
		);
	};

	renderSubmitButton = () => {
		const {onSubmit, submitText, submitting} = this.props;

		return (
			<Button className={styles.submitButton} disabled={submitting} onClick={onSubmit} variant='INFO'>
				{submitText}
			</Button>
		);
	};

	render () {
		const panel = document.getElementById('panel');
		return panel ? createPortal(this.renderForm(), panel) : null;
	}
}

export default Form;
