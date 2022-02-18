// @flow
import CloseIcon from 'icons/CloseIcon';
import type {CloseToast} from 'types/close';
import React from 'react';
import styles from './ToastClose.less';

const ToastClose = (closeToast: CloseToast) => (
	<div className={styles.closeIcon} onClick={closeToast.closeToast}>
		<CloseIcon />
	</div>
);

export default ToastClose;
