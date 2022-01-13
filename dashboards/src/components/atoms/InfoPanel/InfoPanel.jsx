// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import {VARIANTS} from './constants';

export class InfoPanel extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		variant: VARIANTS.DANGER
	};

	getContainerCN = () => {
		const {className, variant} = this.props;
		const {DANGER, WARNING} = VARIANTS;

		return cn({
			[styles.container]: true,
			[styles.danger]: variant === DANGER,
			[styles.warning]: variant === WARNING
		}, className);
	};

	renderCloseIcon = () => <Icon className={styles.closeIcon} name={ICON_NAMES.CANCEL} onClick={this.props.onClose} />;

	renderConfirmButton = () => {
		const {onConfirm} = this.props;

		if (onConfirm) {
			return <button className={styles.confirmButton} onClick={onConfirm}><T text="InfoPanel::onConfirm" /></button>;
		}
	};

	renderControls = () => (
		<div className={styles.controlsContainer}>
			{this.renderConfirmButton()}
			{this.renderCloseIcon()}
		</div>
	);

	renderText = () => <div><b><T text="InfoPanel::Attention" /></b> {this.props.text}</div>;

	render () {
		return (
			<div className={this.getContainerCN()}>
				{this.renderText()}
				{this.renderControls()}
			</div>
		);
	}
}

export default InfoPanel;
