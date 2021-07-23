// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import Toast from 'components/atoms/Toast';
import type {Toast as ToastType} from 'store/toasts/types';

export class ToastContainer extends Component<Props> {
	removeToast = (toast: ToastType) => {
		const {removeToast} = this.props;
		const {id, time} = toast;

		setTimeout(() => removeToast(id), time);
	};

	renderToast = () => {
		const {toasts} = this.props;
		const toast = Object.values(toasts)[0];

		if (toast) {
			// $FlowFixMe
			return <Toast data={toast} key={toast.id} onMount={this.removeToast} />;
		}

		return null;
	};

	render () {
		return this.renderToast();
	}
}

export default connect(props, functions)(ToastContainer);
