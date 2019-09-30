// @flow
import type {Props} from './types';
import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import WidgetAddingPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const DashboardRightPanel = ({selectedWidget}: Props) => {
	const transitionCustomClasses = {
		enter: 'panelEnter',
		enterActive: 'panelEnterActive',
		leave: 'panelLeave',
		leaveActive: 'panelLeaveActive'
	};

	return (
		<ReactCSSTransitionGroup
			component={Fragment}
			transitionName={transitionCustomClasses}
			transitionEnterTimeout={300}
			transitionLeaveTimeout={300}
		>
			{selectedWidget ? <WidgetFormPanel key={1} /> : <WidgetAddingPanel key={2} />}
		</ReactCSSTransitionGroup>
	);
};

export default DashboardRightPanel;
