// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import {createPortal} from 'react-dom';
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from './constants';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import {root} from 'app.constants';
import styles from './styles.less';
import t from 'localization';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import withBlurRoot from 'src/components/organisms/Startup/withBlurRoot';

export class Modal extends Component<Props> {
	static defaultProps = {
		blurRoot: false,
		children: null,
		className: '',
		defaultButton: DEFAULT_BUTTONS.SUBMIT_BUTTON,
		footerPosition: FOOTER_POSITIONS.LEFT,
		notice: false,
		setBlurRoot: value => {},
		showCancelButton: true,
		size: SIZES.NORMAL,
		submitting: false
	};

	getContainerCN = () => {
		const {className, size} = this.props;
		const {FULL_WIDTH, LARGE, SMALL} = SIZES;

		return cn({
			[className]: true,
			[styles.container]: true,
			[styles.fullWidth]: size === FULL_WIDTH,
			[styles.largeContainer]: size === LARGE,
			[styles.smallContainer]: size === SMALL
		});
	};

	componentDidMount () {
		const {blurRoot, setBlurRoot} = this.props;

		if (blurRoot && setBlurRoot) {
			setBlurRoot(true);
		}
	}

	componentWillUnmount () {
		const {setBlurRoot} = this.props;

		if (setBlurRoot) {
			setBlurRoot(false);
		}
	}

	prevent = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	renderCancelButton = () => {
		const {cancelText = t('Modal::Cancel'), defaultButton, onClose, showCancelButton} = this.props;
		const variant = defaultButton === DEFAULT_BUTTONS.CANCEL_BUTTON ? BUTTON_VARIANTS.INFO : BUTTON_VARIANTS.ADDITIONAL;

		if (showCancelButton) {
			return (
				<Button className={styles.cancelButton} onClick={onClose} variant={variant}>{cancelText}</Button>
			);
		}

		return null;
	};

	renderDefaultFooter = () => (
		<Fragment>
			{this.renderSubmitButton()}
			{this.renderCancelButton()}
		</Fragment>
	);

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
		const footer = renderFooter ? renderFooter() : this.renderDefaultFooter();

		return (
			<div className={footerCN}>
				{footer}
			</div>
		);
	};

	renderModalHeader = () => <div className={styles.header}>{this.props.header}</div>;

	renderSubmitButton = () => {
		const {defaultButton, onSubmit, submitText = t('Modal::Save'), submitting} = this.props;
		const variant = defaultButton === DEFAULT_BUTTONS.SUBMIT_BUTTON ? BUTTON_VARIANTS.INFO : BUTTON_VARIANTS.ADDITIONAL;

		return (
			<Button disabled={submitting} onClick={onSubmit} variant={variant}>{submitText}</Button>
		);
	};

	render () {
		return root ? createPortal(this.renderModal(), root) : null;
	}
}

export default withBlurRoot(Modal);
