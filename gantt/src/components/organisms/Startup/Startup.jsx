// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {fetchDashboard} = this.props;

		fetchDashboard();
	}

	render () {
		const {children, error, loading, personal} = this.props;

		if (error) {
			return <p>Ошибка загрузки дашборда</p>;
		}

		if (loading) {
			return <p>Загрузка...</p>;
		}

		return (
			<div className={styles.container} key={personal.toString()}>
				{children}
			</div>
		);
	}
}

export default Startup;
