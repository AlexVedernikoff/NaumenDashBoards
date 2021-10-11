// @flow
import cn from 'classnames';
import DashboardPanel from 'containers/DashboardPanel';
import type {Props} from 'containers/DashboardContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import WidgetsGrid from 'containers/WidgetsGrid/WidgetsGrid';

export class DashboardContent extends PureComponent<Props> {
	renderPanel = () => {
		const {editMode} = this.props;

		return editMode ? <DashboardPanel /> : null;
	};

	render () {
		const {isMobileDevice} = this.props;
		const className = cn(styles.content, {
			[styles.contentMobile]: isMobileDevice
		});

		return (
			<div className={className}>
				<WidgetsGrid />
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardContent;
