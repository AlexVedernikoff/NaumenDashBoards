// @flow
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Toast.less';
import ToastClose from 'components/atoms/ToastClose';
import {ToastContainer} from 'react-toastify';

const Toast = () =>
	<div className='toastMap'>
		<ToastContainer
			className={styles.toastContainer}
			closeButton={<ToastClose type='default'/>}
			closeOnClick={false}
			draggable={false}
			hideProgressBar
			newestOnTop={false}
			pauseOnHover
			pauseOnVisibilityChange
			position="bottom-left"
			rtl={false}
		/>
	</div>;

export default Toast;
