// @flow
import CloseIcon from 'icons/close.svg';
import cn from 'classnames';
import type {Props} from 'containers/DocumentVerifyPopup/types';
import React, {useEffect} from 'react';
import styles from './styles.less';

const DocumentVerifyPopup = ({setNotificationData, verify}: Props) => {
	useEffect(() => {
		if (verify.notification.show) {
			window.setTimeout(() => setNotificationData(false), 4000);
		}
	}, [verify.notification.show]);

	const handleCLickClose = () => {
		setNotificationData(false);
	};

	const classNames = cn({
		[styles.container]: true,
		[styles.show]: verify.notification.show,
		[styles.isSuccess]: verify.notification.isSuccess
	});

	const renderMessage = () => {
		if (verify.notification.isSuccess) {
			return 'Новый документ сформирован и прикреплён в разделе "Документ (файл)" решения';
		}

		return 'Не удалось сформировать новый документ';
	};

	const renderCloseButton = () => {
		return <CloseIcon className={styles.close} onClick={handleCLickClose} />;
	};

	return (
		<div className={classNames}>
			{renderMessage()}
			{renderCloseButton}
		</div>
	);
};

export default DocumentVerifyPopup;
