// @flow
import LayoutGrid from 'containers/LayoutGrid';
import type {Props} from 'containers/DashboardViewContent/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DashboardViewContent extends Component<Props> {
	render () {
		const {widgets} = this.props;

		return (
			<div className={styles.container}>
				<div className={styles.grid}>
					<LayoutGrid widgets={widgets} />
				</div>
			</div>
		);
	}
}

export default DashboardViewContent;
