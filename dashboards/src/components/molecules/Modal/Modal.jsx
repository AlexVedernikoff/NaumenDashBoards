// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import {FOOTER_POSITIONS, SIZES} from './constants';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import {root} from 'app.constants';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Modal extends Component<Props> {
	static defaultProps = {
		cancelText: 'Отмена',
		children: null,
		className: '',
		footerPosition: FOOTER_POSITIONS.LEFT,
		notice: false,
		size: SIZES.NORMAL,
		submitText: 'Сохранить'
	};

	getContainerCN = () => {
		const {className, size} = this.props;
		const {LARGE, SMALL} = SIZES;

		return cn({
			[className]: true,
			[styles.container]: true,
			[styles.largeContainer]: size === LARGE,
			[styles.smallContainer]: size === SMALL
		});
	};

	prevent = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	renderDefaultFooter = () => {
		const {cancelText, onClose, onSubmit, submitText} = this.props;

		return (
			<Fragment>
				<Button onClick={onSubmit}>{submitText}</Button>
				<Button className={styles.cancelButton} onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>{cancelText}</Button>
			</Fragment>
		);
	};

	renderModal = () => {
		const {size} = this.props;
		const width = Number.isInteger(size) && size;

		return (
			<div className={styles.modal}>
				<div className={this.getContainerCN()} onClick={this.prevent} style={{width}}>
					{this.renderModalHeader()}
					{this.renderModalBody()}
					{this.renderModalFooter()}
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

	renderModalFooter = () => {
		const {footerPosition, renderFooter} = this.props;
		const footerCN = cn({
			[styles.footer]: true,
			[styles.rightFooter]: footerPosition === FOOTER_POSITIONS.RIGHT
		});

		return (
			<div className={footerCN}>
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
