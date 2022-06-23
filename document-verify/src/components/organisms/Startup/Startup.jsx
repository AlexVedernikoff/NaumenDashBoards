// @flow
import type {Props} from 'containers/Startup/types';
import React, {useEffect} from 'react';
import styles from './styles.less';

const Startup = ({children, error, getDataVerify, loading}: Props) => {
	useEffect(() => {
		getDataVerify();
	}, []);

	if (loading) {
		return <div className={styles.center}>Загрузка данных</div>;
	}

	if (error) {
		return <div className={styles.center}>Ошибка загрузки данных</div>;
	}

	return (
		<div className={styles.container}>
			{children}
		</div>
	);
};

export default Startup;
