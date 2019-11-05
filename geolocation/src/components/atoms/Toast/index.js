// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Toast.less';
import ToastClose from 'components/atoms/ToastClose';
import {ToastContainer} from 'react-toastify';

export class Toast extends Component<Props> {
	render () {
		return (
			<div className='toastMap'>
				<ToastContainer
					position="bottom-right"
					closeButton={<ToastClose type='default'/>}
					className={styles.toastContainer}
					hideProgressBar
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnVisibilityChange
					draggable={false}
					pauseOnHover
				/>
			</div>
		);
	}
}

export default Toast;
