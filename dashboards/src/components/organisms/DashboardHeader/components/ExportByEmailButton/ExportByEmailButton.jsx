// @flow
import ExportByEmailForm from 'containers/ExportByEmailForm';
import {IconButton} from 'components/organisms/DashboardHeader/components';
import {ICON_NAMES} from 'components/atoms/Icon';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ExportByEmailButton extends PureComponent<Props, State> {
	state = {
		show: false
	};

	handleClickOutside = () => this.setState({show: false});

	handleToggleForm = () => this.setState({show: !this.state.show});

	renderButton = () => <IconButton name={ICON_NAMES.MAIL} onClick={this.handleToggleForm} tip="Отправить на почту" />;

	renderForm = () => this.state.show && <ExportByEmailForm className={styles.form} />;

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.handleClickOutside}>
				<div className={styles.container}>
					{this.renderButton()}
					{this.renderForm()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default ExportByEmailButton;
