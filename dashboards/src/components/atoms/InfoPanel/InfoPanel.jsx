// @flow
import {CloseIcon} from 'icons/form';
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class InfoPanel extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		variant: 'danger'
	};

	renderCloseIcon = () => <CloseIcon className={styles.closeIcon} onClick={this.props.onClose} />;

	renderConfirmButton = () => {
		const {onConfirm} = this.props;

		if (onConfirm) {
			return <button className={styles.confirmButton} onClick={onConfirm}>Подтвердить</button>;
		}
	};

	render () {
		const {className, text, variant} = this.props;
		const containerCN = cn(styles.container, styles[variant], className);

		return (
			<div className={containerCN}>
				<div><b>Внимание!</b> {text}</div>
				<div>
					{this.renderConfirmButton()}
					{this.renderCloseIcon()}
				</div>
			</div>
		);
	}
}

export default InfoPanel;
