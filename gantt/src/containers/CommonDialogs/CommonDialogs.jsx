// @flow
import {CommonDialogContext} from './withCommonDialog';
import type {CommonDialogContextProps, InternalProps} from './types';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Modal from 'components/molecules/Modal';
import React, {Component, Fragment} from 'react';

export class CommonDialogs extends Component<InternalProps> {
	getCommonDialogContextValues = (): CommonDialogContextProps => {
		const {confirmDialog, showAlert} = this.props;
		return {
			alert: showAlert,
			confirm: confirmDialog
		};
	};

	handleCloseConfirmDialog = (submitResult: boolean) => () => {
		const {closeConfirmDialog} = this.props;

		closeConfirmDialog(submitResult);
	};

	renderAlertModal = (): React$Node => {
		const {alertModal, closeAlert} = this.props;

		if (alertModal) {
			const {options} = alertModal;
			return (
				<Modal {...options} onSubmit={closeAlert}>
					{options.text}
				</Modal>
			);
		}

		return null;
	};

	renderConfirmModal = (): React$Node => {
		const {confirmModal} = this.props;

		if (confirmModal) {
			const {options} = confirmModal;
			return (
				<Modal {...options} onClose={this.handleCloseConfirmDialog(false)} onSubmit={this.handleCloseConfirmDialog(true)}>
					{options.text}
				</Modal>
			);
		}

		return null;
	};

	render () {
		const {children} = this.props;
		const value = this.getCommonDialogContextValues();

		return (
			<Fragment>
				{this.renderAlertModal()}
				{this.renderConfirmModal()}
				<CommonDialogContext.Provider value={value}>
					{children}
				</CommonDialogContext.Provider>
			</Fragment>
		);
	}
}

export default connect(props, functions)(CommonDialogs);
