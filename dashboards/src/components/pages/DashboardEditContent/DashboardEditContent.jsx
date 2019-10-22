// @flow
import DashboardRightPanel from 'components/organisms/DashboardRightPanel';
import type {Layout} from 'utils/layout/types';
import LayoutGrid from 'containers/LayoutGrid';
import type {Props} from 'containers/DashboardEditContent/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DashboardEditContent extends Component<Props> {
	handleWidgetSelect = (widgetId: string) => {
		const {selectWidget, selectedWidget} = this.props;

		if (widgetId !== selectedWidget) 	{
			selectWidget(widgetId);
		}
	};

	onLayoutChange = (layout: Layout) => {
		const {editLayout} = this.props;
		editLayout(layout);
	};

	getWidgets = () => {
		const {newWidget, widgets} = this.props;

		if (newWidget) {
			return {...widgets, newWidget};
		}

		return widgets;
	};

	renderGrid = () => {
		const widgets = this.getWidgets();

		return (
			<div className={styles.container}>
				<LayoutGrid
					editable={true}
					onSelectWidget={this.handleWidgetSelect}
					onLayoutChange={this.onLayoutChange}
					widgets={widgets}
				/>
			</div>
		);
	};

	renderPanel = () => {
		const {selectedWidget} = this.props;

		return (
			<div className={styles.panel}>
				<DashboardRightPanel selectedWidget={selectedWidget}/>
			</div>
		);
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderGrid()}
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardEditContent;
