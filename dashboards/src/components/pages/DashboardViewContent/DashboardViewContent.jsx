// @flow
import LayoutGrid from 'containers/LayoutGrid';
import type {Props} from 'containers/DashboardViewContent/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DashboardViewContent extends Component<Props> {
	handleWidgetSelect = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
		const {selectWidget, selectedWidget} = this.props;
		const {id} = e.currentTarget.dataset;

		if (id !== selectedWidget) 	{
			selectWidget(id);
		}
	};

	render () {
		const {widgets} = this.props;

		return (
			<div className={styles.container}>
				<div className={styles.grid}>
					<LayoutGrid widgets={widgets} onWidgetSelect={this.handleWidgetSelect}/>
				</div>
			</div>
		);
	}
}

export default DashboardViewContent;
