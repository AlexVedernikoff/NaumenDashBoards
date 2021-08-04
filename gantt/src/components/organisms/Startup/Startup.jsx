// @flow
import {Loader} from 'naumen-common-components';
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAppConfig} = this.props;
		getAppConfig();
	}

	render () {
		const {children, error, loading} = this.props;

		if (error) {
			return <p>Ошибка загрузки ${error}</p>;
		}

		if (loading) {
			return (
				<div className={styles.center}>
					<Loader size={50} />
				</div>
			);
		}

		return (
			<div className={styles.container}>
				{children}
			</div>
		);
	}
}

export default Startup;
