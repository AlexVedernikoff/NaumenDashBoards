// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getVerify} = this.props;

		getVerify();
	}

	render () {
		const {
			children,
			error,
			loading} = this.props;

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
	}
}

export default Startup;
