// @flow
import {Button} from 'components/atoms';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import {FOOTER_POSITIONS, SIZES} from './constants';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import {root} from 'src';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Modal extends Component<Props> {
	static defaultProps = {
		cancelText: 'Отмена',
		children: null,
		footerPosition: FOOTER_POSITIONS.LEFT,
		size: SIZES.NORMAL,
		submitText: 'Сохранить'
	};

	getContainerCN = () => {
		const {size} = this.props;
		const {LARGE, SMALL} = SIZES;

		return cn({
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
				<Button className={styles.submitButton} onClick={onSubmit}>{submitText}</Button>
				<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>{cancelText}</Button>
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
		const {children} = this.props;

		if (children) {
			return <div className={styles.content}>{children}</div>;
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
