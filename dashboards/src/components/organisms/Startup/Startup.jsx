// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {fetchDashboard} = this.props;

		fetchDashboard();
	}

	render () {
		const {children, error, loading, personal} = this.props;

		if (error) {
			return <p>{error}</p>;
		}

		if (loading) {
			return (<p><T>Startup::Loading</T></p>);
		}

		return (
			<div className={styles.container} key={personal.toString()}>
				{children}
			</div>
		);
	}
}

export default Startup;
