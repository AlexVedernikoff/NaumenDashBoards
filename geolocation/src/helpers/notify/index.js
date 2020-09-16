// @flow
import React from 'react';
import styles from './Notify.less';
import {toast, cssTransition} from 'react-toastify';
import type {MessageStyleType, NotifyTemplateType} from 'types/helper';

const transitionToast = cssTransition({
	duration: 10
});

const getPreparedMessage = (notifyTemplateType: NotifyTemplateType, text: string) => {
	let message = '';

	switch (notifyTemplateType) {
		case 'error':
			message = (
				<div>
					Произошла ошибка при получении данных. Обратитесь к администратору системы.
				</div>
			);
			break;
		case 'empty':
			message = (
				<div>
					Нет данных для отображения меток
				</div>
			);
			break;
		case 'static':
			message = (
				<div className={styles.textNotify}>
					Нет информации о местоположении неподвижных меток: <br />
					{text}
				</div>
			);
			break;
		case 'dynamic':
			message = (
				<div className={styles.textNotify}>
					Нет информации о местоположении подвижных меток: <br />
					{text}
				</div>
			);
			break;
		default:
			message = (
				<div className={styles.textNotify}>
					{text}
				</div>
			);
	}
	return message;
};

export const notify = (notifyTemplateType: NotifyTemplateType, messageStyleType: MessageStyleType, text: string = '') => {
	const notifyMessage = getPreparedMessage(notifyTemplateType, text);

	toast(notifyMessage, {
		autoClose: false,
		className: styles[messageStyleType],
		draggable: false,
		hideProgressBar: true,
		pauseOnHover: true,
		position: 'bottom-left',
		transition: transitionToast
	});
};
