// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {fetchDashboard} = this.props;

		fetchDashboard();
	}

	render () {
		const {children, error, loading} = this.props;

		if (error) {
			return <p>Ошибка загрузки дашборда</p>;
		}

		if (loading) {
			return <p>Загрузка...</p>;
		}

		return children;
	}
}

export default Startup;
