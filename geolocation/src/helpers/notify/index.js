// @flow
import React from 'react';
import styles from './Notify.less';
import {toast} from 'react-toastify';

const message = (labelMarkers: string) => {
	return (
		<div>
			Нет информации о местоположении: <br />
			{labelMarkers}
		</div>
	);
};

export const notify = (labelMarkers: string) => {
	const notifyMessage = message(labelMarkers);

	toast(notifyMessage, {
		autoClose: false,
		className: styles.popupError,
		draggable: false,
		hideProgressBar: true,
		pauseOnHover: true,
		position: 'bottom-right'
	});
};
