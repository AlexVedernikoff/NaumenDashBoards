// @flow
import LayoutGrid from 'components/molecules/LayoutGrid/LayoutGrid';
import type {Props} from 'containers/DashboardViewContent/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DashboardViewContent extends Component<Props> {
	renderGrid = () => {
		const {charts, widgets} = this.props;

		return (
			<LayoutGrid
				charts={charts}
				widgets={widgets}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				<div className={styles.grid}>
					{this.renderGrid()}
				</div>
			</div>
		);
	}
}

export default DashboardViewContent;
