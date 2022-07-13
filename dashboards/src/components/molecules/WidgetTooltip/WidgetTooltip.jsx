// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import cn from 'classnames';
import Container from 'components/atoms/Container';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import IconButton, {VARIANTS} from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import type {Props, State} from './types';
import React, {createRef, forwardRef, Fragment, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import t from 'localization';

export class WidgetTooltip extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		text: '[?]',
		tooltip: DEFAULT_TOOLTIP_SETTINGS
	};

	state = {
		showModal: false
	};

	ref: Ref<'span'> = createRef();

	getComponents = memoize(() => {
		const {components = {}} = this.props;
		return {
			Icon: this.renderSpan,
			Modal: Container,
			ModalBody: Container,
			ModalHeader: Container,
			...components
		};
	});

	getStyle = () => {
		const {
			tooltip: {
				fontFamily = DEFAULT_TOOLTIP_SETTINGS.fontFamily,
				fontSize = DEFAULT_TOOLTIP_SETTINGS.fontSize
			}
		} = this.props;

		return {fontFamily, fontSize};
	};

	handleHideModal = e => {
		e.stopPropagation();
		this.setState({showModal: false});
	};

	handleModalClick = e => {
		e.stopPropagation();
	};

	handleShowModal = e => {
		e.stopPropagation();
		this.setState({showModal: true});
	};

	renderAbsoluteModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return (
				<AbsolutePortal elementRef={this.ref} isModal={false} onClickOutside={this.handleHideModal}>
					{this.renderModal()}
				</AbsolutePortal>
			);
		}

		return null;
	};

	renderIcon = () => {
		const {className, text} = this.props;
		const spanClassName = cn(styles.tooltipHandler, className);
		const {Icon} = this.getComponents();

		return (
			<Icon className={spanClassName} onClick={this.handleShowModal} ref={this.ref} title="">
				{text}
			</Icon>
		);
	};

	renderModal = () => {
		const {Modal} = this.getComponents();

		return (
			<Modal className={styles.modal} onClick={this.handleModalClick}>
				{this.renderModalHeader()}
				{this.renderModalBody()}
			</Modal>
		);
	};

	renderModalBody = () => {
		const {tooltip} = this.props;
		const text = tooltip.text ?? tooltip.title ?? '';
		const {ModalBody} = this.getComponents();

		return (
			<ModalBody className={styles.modalBody} style={this.getStyle()}>
				{text}
			</ModalBody>
		);
	};

	renderModalHeader = () => {
		const {tooltip: {header = t('WidgetTooltip::DefaultHeader')}} = this.props;
		const {ModalHeader} = this.getComponents();

		return (
			<ModalHeader className={styles.modalHeader} style={this.getStyle()}>
				<div>{header}</div>
				<div>
					<IconButton
						icon={ICON_NAMES.CLOSE}
						onClick={this.handleHideModal}
						round={false}
						variant={VARIANTS.INFO}
					/>
				</div>
			</ModalHeader>
		);
	};

	// eslint-disable-next-line react/display-name
	renderSpan = forwardRef((props, ref) => <span {...props} ref={ref}>{props.children}</span>);

	render () {
		const {tooltip} = this.props;
		const {show} = tooltip ?? DEFAULT_TOOLTIP_SETTINGS;

		if (show) {
			return (
				<Fragment>
					{this.renderIcon()}
					{this.renderAbsoluteModal()}
				</Fragment>
			);
		}

		return null;
	}
}

export default WidgetTooltip;
