// @flow
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';
import type {Layout} from 'utils/layout/types';
import LayoutGrid from 'containers/LayoutGrid';
import type {Props} from 'containers/DashboardEditContent/types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';

export const editContentRef = createRef();

export class DashboardEditContent extends Component<Props> {
	handleLayoutChange = (layout: Layout) => {
		const {editLayout} = this.props;
		editLayout(layout);
	};

	handleWidgetSelect = (widgetId: string) => {
		const {selectWidget, selectedWidget} = this.props;

		if (widgetId !== selectedWidget) 	{
			selectWidget(widgetId);
		}
	};

	getWidgets = () => {
		const {newWidget, widgets} = this.props;

		if (newWidget) {
			return {...widgets, newWidget};
		}

		return widgets;
	};

	renderGrid = () => {
		const {removeWidget, role, selectedWidget} = this.props;
		const widgets = this.getWidgets();

		return (
			<div className={styles.container} ref={editContentRef}>
				<LayoutGrid
					editable={true}
					onLayoutChange={this.handleLayoutChange}
					onRemoveWidget={removeWidget}
					onSelectWidget={this.handleWidgetSelect}
					role={role}
					selectedWidget={selectedWidget}
					widgets={widgets}
				/>
			</div>
		);
	};

	renderPanel = () => {
		const {selectedWidget} = this.props;

		return (
			<div className={styles.panel}>
				{selectedWidget ? <WidgetFormPanel /> : <WidgetAddPanel />}
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
