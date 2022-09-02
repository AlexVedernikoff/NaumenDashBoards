// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from 'components/containers/Startup/types';
import React, {useEffect} from 'react';
import styles from './styles.less';

const Startup = ({children, error, getDataEntity, loading}: Props) => {
	useEffect(() => {
		getDataEntity();
	}, []);

	if (loading) {
		return <div className={styles.center}>Загрузка данных</div>;
	}

	if (error) {
		return <div className={styles.center}>Ошибка загрузки данных!</div>;
	}

	return <div className={styles.content}>{children}</div>;
};

export default connect(props, functions)(Startup);
