// @flow
import DashboardPanel from 'components/organisms/DashboardPanel';
import type {Props} from 'containers/DashboardContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import WidgetsGrid from 'containers/WidgetsGrid/WidgetsGrid';

export class DashboardContent extends PureComponent<Props> {
	renderPanel = () => {
		const {editMode, selectedWidget} = this.props;

		return editMode || selectedWidget ? <DashboardPanel selectedWidget={selectedWidget} /> : null;
	};

	render () {
		return (
			<div className={styles.content}>
				<WidgetsGrid />
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardContent;
