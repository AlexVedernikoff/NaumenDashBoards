// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAppConfig, getGanttData} = this.props;
		getAppConfig();
		getGanttData();
	}

	render () {
		const {children, error} = this.props;

		if (error) {
			return <p>Ошибка загрузки</p>;
		}

		return (
			<div className={styles.container}>
				{children}
			</div>
		);
	}
}

export default Startup;
